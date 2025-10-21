# RPM Distribution Infrastructure

Complete infrastructure for distributing Leger as RPM packages via a custom repository hosted on Cloudflare R2.

## Quick Links

- **[Setup Checklist](./rpm-distribution-checklist.md)** - Step-by-step checklist
- **[Detailed Setup Guide](./rpm-distribution-setup.md)** - Complete documentation
- **Repository URL:** https://pkgs.leger.run/fedora

## What's Included

This infrastructure provides:

1. **Automated RPM builds** for x86_64 and aarch64 architectures
2. **GPG signing** of all packages for security
3. **Automated publishing** to Cloudflare R2 on each release
4. **Repository metadata** generation for DNF/YUM integration
5. **One-command installation** for end users

## How It Works

```
Developer pushes tag → GitHub Actions builds & signs RPMs →
Publishes to R2 → Users install with `dnf install leger`
```

### For Developers

**Creating a release:**
```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions automatically:
- Builds RPMs for amd64 and arm64
- Signs them with GPG
- Creates a GitHub Release
- Publishes to R2 repository

**Local development:**
```bash
make rpm-all              # Build RPMs
make sign GPG_KEY=email   # Sign RPMs
make verify               # Verify signatures
```

### For End Users

**Installation:**
```bash
sudo dnf config-manager --add-repo https://pkgs.leger.run/fedora/leger.repo
sudo dnf install leger
```

**Updates:**
```bash
sudo dnf update leger
```

## Files Structure

```
leger/
├── .github/workflows/
│   └── release.yml              # Builds, signs, publishes RPMs
├── scripts/
│   ├── generate-gpg-key.sh      # Creates GPG key pair
│   └── publish-rpm.sh           # Publishes to R2 + generates repodata
├── packaging/
│   └── leger.repo               # Repository configuration for users
├── docs/
│   ├── rpm-distribution-README.md      # This file
│   ├── rpm-distribution-setup.md       # Detailed setup guide
│   └── rpm-distribution-checklist.md   # Setup checklist
├── release/rpm/
│   ├── postinst.sh              # Post-installation script
│   ├── prerm.sh                 # Pre-removal script
│   └── postrm.sh                # Post-removal script
├── systemd/
│   ├── legerd.service           # User service
│   ├── legerd@.service          # System service
│   └── legerd.default           # Default environment
├── nfpm.yaml                    # RPM package configuration
└── Makefile                     # Build targets
```

## Infrastructure Components

### GitHub Actions Workflow

**File:** `.github/workflows/release.yml`

**Jobs:**
1. **build** - Builds and signs RPMs for both architectures
2. **release** - Creates GitHub Release with RPMs
3. **publish** - Publishes to R2 repository

**Secrets required:**
- `GPG_PRIVATE_KEY` - Private GPG key for signing
- `R2_ACCESS_KEY_ID` - Cloudflare R2 access key
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2 secret key
- `R2_ENDPOINT` - R2 endpoint URL
- `R2_BUCKET_NAME` - R2 bucket name

### GPG Signing

**Script:** `scripts/generate-gpg-key.sh`

Generates a GPG key pair for signing RPM packages:
- Key type: RSA 4096
- Email: packages@leger.run
- Never expires
- No passphrase (for CI/CD automation)

**Security:** Private key stored only in GitHub Secrets, never committed to git.

### R2 Repository

**Script:** `scripts/publish-rpm.sh`

Publishes RPMs to Cloudflare R2:
1. Downloads existing repository
2. Adds new RPMs
3. Generates/updates repository metadata (repodata)
4. Uploads GPG public key
5. Uploads repository configuration
6. Syncs to R2 bucket

**Structure:**
```
pkgs.leger.run/
└── fedora/
    ├── x86_64/
    │   └── [RPM files]
    ├── aarch64/
    │   └── [RPM files]
    ├── repodata/
    │   ├── repomd.xml
    │   └── [metadata files]
    ├── repo.gpg          # Public GPG key
    └── leger.repo        # Repository configuration
```

## Setup Overview

### Phase 1: Infrastructure Files (✅ Complete)

All necessary files have been created:
- Scripts for GPG key generation and publishing
- GitHub Actions workflow updates
- Repository configuration template
- Documentation

### Phase 2: Manual Configuration (To Do)

You need to:
1. **Generate GPG key** - Run `./scripts/generate-gpg-key.sh`
2. **Create R2 bucket** - Set up on Cloudflare dashboard
3. **Configure custom domain** - Point `pkgs.leger.run` to R2
4. **Add GitHub secrets** - Configure CI/CD credentials

**See the [Setup Checklist](./rpm-distribution-checklist.md) for step-by-step instructions.**

## Cost Estimate

Cloudflare R2 is extremely cost-effective:

**For Leger (estimated):**
- Storage: ~0.5 GB → $0.0075/month
- Operations: ~120K reads/month → $0.04/month
- Egress: FREE (unlimited)

**Total: ~$0.60/year**

vs AWS S3:
- Storage: ~$0.12/month
- Operations: ~$0.04/month
- Egress: ~$10-100/month (10GB-100GB at $0.09/GB)

**R2 saves ~$120-1200/year** on egress alone!

## Maintenance

### Regular Releases

Just push a tag - automation handles the rest:

```bash
git tag v0.2.0
git push origin v0.2.0
```

### Quarterly Tasks

- Rotate R2 API tokens (recommended)
- Review usage and costs in Cloudflare dashboard

### Annual Tasks

- Consider rotating GPG key
- Update documentation
- Audit access controls

## Testing

### Before First Production Release

1. Generate GPG key locally
2. Test local build and signing
3. Create test tag (`v0.0.1-test`)
4. Verify GitHub Actions workflow
5. Configure R2 and GitHub secrets
6. Create production tag (`v0.1.0`)
7. Verify repository is accessible
8. Test installation on Fedora/RHEL

### For Each Release

1. Monitor GitHub Actions workflow
2. Verify GitHub Release created
3. Check R2 repository updated
4. Test installation update

## Troubleshooting

### Common Issues

**"GPG signature verification failed"**
- Ensure `repo.gpg` is accessible at repository URL
- Import key manually: `sudo rpm --import https://pkgs.leger.run/fedora/repo.gpg`

**"Failed to synchronize cache for repo 'leger-stable'"**
- Check repository URL is accessible
- Verify custom domain DNS is configured
- Clear DNF cache: `sudo dnf clean all && sudo dnf makecache`

**GitHub Actions failing at "Sign RPM"**
- Verify `GPG_PRIVATE_KEY` secret is set correctly
- Check key email matches `packages@leger.run`

**GitHub Actions failing at "Publish to R2"**
- Verify all R2 secrets are set
- Check R2 bucket permissions
- Ensure R2 API token has write access

**See [Detailed Setup Guide](./rpm-distribution-setup.md) for more troubleshooting.**

## References

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [RPM Packaging Guide](https://rpm-packaging-guide.github.io/)
- [nfpm Documentation](https://nfpm.goreleaser.com/)
- [createrepo_c](https://github.com/rpm-software-management/createrepo_c)
- [DNF Configuration](https://dnf.readthedocs.io/)

## Support

- **Issues:** https://github.com/leger-labs/leger/issues
- **Email:** packages@leger.run
- **Docs:** https://leger.run/docs/

---

**Status:** Infrastructure files complete, ready for manual configuration steps.
