# GitHub Workflow Setup Instructions

⚠️ **IMPORTANT**: This file contains the GitHub Actions workflow that must be manually created due to security restrictions.

## Overview

The release workflow automates RPM building and GitHub release creation for multi-architecture packages (amd64 and arm64).

## Required Manual Step

The workflow file content is provided below. **You must manually create** `.github/workflows/release.yml` with this content:

### Step 1: Create the File

```bash
mkdir -p .github/workflows
```

Copy the workflow content from `/tmp/workflows/release.yml` (created during this PR) to `.github/workflows/release.yml`.

Or use the content below:

<details>
<summary>Click to expand: release.yml content</summary>

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to release (e.g., v0.1.0-test)'
        required: true
        type: string

permissions:
  contents: write

jobs:
  build:
    name: Build RPM (${{ matrix.arch }})
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        include:
          - arch: amd64
            goarch: amd64
            rpm_arch: x86_64
          - arch: arm64
            goarch: arm64
            rpm_arch: aarch64

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Need full history for git describe

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version-file: 'go.mod'
          cache: true

      - name: Get version
        id: version
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            VERSION="${{ github.event.inputs.version }}"
          else
            VERSION="${GITHUB_REF#refs/tags/}"
          fi
          VERSION_SHORT="${VERSION#v}"
          echo "version=${VERSION}" >> $GITHUB_OUTPUT
          echo "version_short=${VERSION_SHORT}" >> $GITHUB_OUTPUT
          echo "Building version: ${VERSION} (${VERSION_SHORT})"

      - name: Install dependencies
        run: |
          go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest

      - name: Build binaries
        env:
          GOOS: linux
          GOARCH: ${{ matrix.goarch }}
          CGO_ENABLED: 0
        run: |
          VERSION="${{ steps.version.outputs.version }}"
          COMMIT="${{ github.sha }}"
          BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

          echo "Building leger and legerd ${VERSION} for ${GOOS}/${GOARCH}"

          # Build CLI binary
          go build -trimpath \
            -ldflags="-X github.com/leger-labs/leger/internal/version.Version=${VERSION} \
                      -X github.com/leger-labs/leger/internal/version.Commit=${COMMIT} \
                      -X github.com/leger-labs/leger/internal/version.BuildDate=${BUILD_DATE} \
                      -w -s" \
            -o leger-${{ matrix.arch }} \
            ./cmd/leger

          # Build daemon binary
          go build -trimpath \
            -ldflags="-X github.com/leger-labs/leger/internal/version.Version=${VERSION} \
                      -X github.com/leger-labs/leger/internal/version.Commit=${COMMIT} \
                      -X github.com/leger-labs/leger/internal/version.BuildDate=${BUILD_DATE} \
                      -w -s" \
            -o legerd-${{ matrix.arch }} \
            ./cmd/legerd

          # Verify binaries
          file leger-${{ matrix.arch }} legerd-${{ matrix.arch }}
          ./leger-${{ matrix.arch }} --version || true
          ./legerd-${{ matrix.arch }} --version || true

      - name: Create RPM
        env:
          VERSION: ${{ steps.version.outputs.version_short }}
          RPM_ARCH: ${{ matrix.rpm_arch }}
          CLI_BINARY: leger-${{ matrix.arch }}
          DAEMON_BINARY: legerd-${{ matrix.arch }}
        run: |
          echo "Creating RPM package: leger-${VERSION}-1.${RPM_ARCH}.rpm"

          # Build RPM using nfpm with environment variables
          nfpm pkg --packager rpm -f nfpm.yaml

          # List generated files
          ls -lh *.rpm

          # Verify RPM contents
          rpm -qilp *.rpm || true

      - name: Upload RPM artifact
        uses: actions/upload-artifact@v4
        with:
          name: rpm-${{ matrix.arch }}
          path: "*.rpm"
          if-no-files-found: error

  release:
    name: Create GitHub Release
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/')

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Get version
        id: version
        run: |
          VERSION="${GITHUB_REF#refs/tags/}"
          echo "version=${VERSION}" >> $GITHUB_OUTPUT

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: artifacts

      - name: Organize RPMs
        run: |
          mkdir -p rpms
          find artifacts -type f -name "*.rpm" -exec cp {} rpms/ \;
          ls -lh rpms/

      - name: Generate release notes
        run: |
          cat > release-notes.md <<'EOF'
          ## Installation

          ### From GitHub Release (Quick Install)

          Download the appropriate RPM for your architecture:

          - **x86_64 (Intel/AMD)**: `leger-*-x86_64.rpm`
          - **aarch64 (ARM64)**: `leger-*-aarch64.rpm`

          Install with:
          ```bash
          sudo dnf install ./leger-*.rpm
          ```

          ## Configuration

          1. Edit the configuration file:
             ```bash
             sudo vim /etc/leger/config.yaml
             ```

          2. Start the daemon:

             For user service:
             ```bash
             systemctl --user enable --now legerd.service
             ```

             For system service:
             ```bash
             sudo systemctl enable --now legerd.service
             ```

          ## Verification

          ```bash
          leger --version
          systemctl --user status legerd.service
          ```

          ## What's New

          See the commits below for detailed changes in this release.
          EOF

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.version.outputs.version }}
          name: Release ${{ steps.version.outputs.version }}
          draft: false
          prerelease: ${{ contains(steps.version.outputs.version, '-') }}
          files: |
            rpms/*.rpm
          body_path: release-notes.md
          generate_release_notes: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Summary
        run: |
          echo "## Release Created! 🎉" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "Version: ${{ steps.version.outputs.version }}" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Artifacts" >> $GITHUB_STEP_SUMMARY
          find rpms -type f -name "*.rpm" | while read rpm; do
            echo "- $(basename $rpm)" >> $GITHUB_STEP_SUMMARY
          done
```

</details>

### Step 2: Commit the Workflow

```bash
git add .github/workflows/release.yml
git commit -m "ci: add RPM build and release workflow"
git push
```

## Workflow Features

### Triggers
- **Tag Push**: Automatically runs on tags matching `v*` (e.g., `v0.1.0`, `v1.2.3-rc1`)
- **Manual Dispatch**: Can be triggered manually via GitHub Actions UI

### Multi-Architecture Support
- Builds for `amd64` (x86_64) and `arm64` (aarch64)
- Creates separate RPM packages for each architecture

### Version Stamping
- Embeds version, commit SHA, and build date into binaries
- Uses git describe for version information

### GitHub Releases
- Automatically creates releases for tag pushes
- Marks pre-releases (versions containing `-`)
- Attaches RPM packages
- Includes installation instructions

## Testing

### Test 1: Manual Dispatch

1. Go to **Actions** → **Release** → **Run workflow**
2. Enter version: `v0.1.0-test`
3. Verify: Both RPM artifacts created

### Test 2: Tag Push

```bash
git tag -a v0.1.0-rc1 -m "Release candidate 1"
git push origin v0.1.0-rc1
```

Verify:
- GitHub release created
- RPMs attached to release
- Installation instructions in release notes

### Test 3: Installation

```bash
curl -LO https://github.com/leger-labs/leger/releases/download/v0.1.0-rc1/leger-0.1.0-1.x86_64.rpm
sudo dnf install ./leger-0.1.0-1.x86_64.rpm
leger --version
```

## Deferred Features

Not included in this initial workflow (per backlog requirements):
- Package signing (future issue)
- Cloudflare R2 deployment (future issue)
- Repository metadata generation (future issue)

## Troubleshooting

### Build fails with version errors
- Ensure `internal/version/version.go` exists with the correct package structure
- Verify ldflags path matches your module name: `github.com/leger-labs/leger/internal/version`

### RPM creation fails
- Check that `nfpm.yaml` exists and references correct files
- Verify systemd units, config files, and scripts exist
- Review nfpm documentation for configuration issues

### RPMs not attached to release
- The release job only runs on tag pushes (not manual dispatch)
- Check that build job completed successfully
- Review release job logs

## Next Steps

1. **Create the workflow file** at `.github/workflows/release.yml` (see above)
2. **Test with manual dispatch** to verify build works
3. **Create test tag** (e.g., `v0.1.0-rc1`) to verify full release flow
4. **Validate installation** from GitHub release

## Related Documentation

- Backlog: `/backlog/issue-4-ci-workflow.md`
- RPM Packaging: `/docs/rpm-packaging/RPM-PACKAGING.md`
- Reference Workflow: `/docs/rpm-packaging/release-cloudflare.yml`

---

**Generated with [Claude Code](https://claude.ai/code)**
