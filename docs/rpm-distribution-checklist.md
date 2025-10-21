# RPM Distribution Setup Checklist

Quick checklist for setting up the RPM distribution infrastructure. See [rpm-distribution-setup.md](./rpm-distribution-setup.md) for detailed instructions.

## Phase 1: Infrastructure Setup (Complete First)

### ✅ Repository Files Created

- [x] `scripts/generate-gpg-key.sh` - GPG key generation script
- [x] `scripts/publish-rpm.sh` - R2 publishing script
- [x] `packaging/leger.repo` - Repository configuration template
- [x] `.github/workflows/release.yml` - Updated with signing & publishing
- [x] `.gitignore` - Updated to exclude GPG private keys

### ✅ Existing Infrastructure (Already in place)

- [x] `nfpm.yaml` - RPM package configuration
- [x] `Makefile` - Build and sign targets
- [x] `systemd/` - Service files
- [x] `release/rpm/` - Install/uninstall scripts
- [x] `config/leger.yaml` - Default configuration

## Phase 2: GPG Key Generation

### [ ] Generate GPG Key Pair

```bash
cd /home/user/leger
./scripts/generate-gpg-key.sh
```

**Creates:**
- `leger-rpm-signing.private.asc` (DO NOT COMMIT!)
- `leger-rpm-signing.public.asc`
- `leger-rpm-signing.keyid`

**Verify:**
```bash
gpg --list-keys packages@leger.run
```

### [ ] Secure the Private Key

- [ ] Backup private key to secure location (password manager, encrypted drive)
- [ ] Confirm `.gitignore` excludes `*.private.asc`
- [ ] Never commit private key to git

## Phase 3: Cloudflare R2 Setup (Manual)

### [ ] Create R2 Bucket

1. Log in to Cloudflare Dashboard
2. Navigate to R2 Object Storage
3. Create bucket named `leger-packages`
4. Choose location closest to users

**Settings:**
- Name: `leger-packages`
- Location: Auto
- Versioning: Disabled

### [ ] Create R2 API Token

1. Go to "Manage R2 API Tokens"
2. Create token: `github-actions-rpm-publisher`
3. Permissions: Object Read & Write on `leger-packages`
4. **Save these values:**

```
Access Key ID: _______________________________
Secret Access Key: _______________________________
Endpoint URL: https://________________.r2.cloudflarestorage.com
```

### [ ] Configure Custom Domain

1. In bucket settings → Custom Domains
2. Add domain: `pkgs.leger.run`
3. Add DNS record as instructed by Cloudflare:

```
Type: CNAME
Name: pkgs
Target: [provided by Cloudflare]
```

4. Wait for DNS propagation (usually < 5 minutes)
5. Verify: `curl -I https://pkgs.leger.run/`

### [ ] Optional: Configure CORS

For browser access to repository metadata:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

## Phase 4: GitHub Secrets Configuration (Manual)

### [ ] Add Secrets to GitHub Repository

Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

#### Required Secrets:

| Secret Name | Source | Example |
|-------------|--------|---------|
| `GPG_PRIVATE_KEY` | Contents of `leger-rpm-signing.private.asc` | -----BEGIN PGP PRIVATE KEY BLOCK----- ... |
| `R2_ACCESS_KEY_ID` | From R2 API Token creation | abc123... |
| `R2_SECRET_ACCESS_KEY` | From R2 API Token creation | xyz789... |
| `R2_ENDPOINT` | From R2 API Token creation | https://abc.r2.cloudflarestorage.com |
| `R2_BUCKET_NAME` | Bucket name from Phase 3 | leger-packages |

**To add GPG_PRIVATE_KEY:**

```bash
cat leger-rpm-signing.private.asc
# Copy entire output including BEGIN/END markers
```

#### Verify Secrets Are Set:

- [ ] `GPG_PRIVATE_KEY` - Contains full private key with headers
- [ ] `R2_ACCESS_KEY_ID` - R2 access key ID
- [ ] `R2_SECRET_ACCESS_KEY` - R2 secret access key
- [ ] `R2_ENDPOINT` - R2 endpoint URL with https://
- [ ] `R2_BUCKET_NAME` - Bucket name

## Phase 5: Testing

### [ ] Local Build Test

```bash
# Build RPMs for all architectures
make rpm-all

# Verify build
ls -lh *.rpm
```

### [ ] Local Signing Test

```bash
# Import GPG key if not already in keyring
gpg --import leger-rpm-signing.private.asc

# Sign RPMs
make sign GPG_KEY=packages@leger.run

# Verify signatures
make verify
```

Expected output:
```
leger-*.rpm: digests signatures OK
```

### [ ] Local Publishing Test (Optional)

```bash
# Set R2 credentials
export R2_ACCESS_KEY_ID="your-key-id"
export R2_SECRET_ACCESS_KEY="your-secret-key"
export R2_ENDPOINT="your-endpoint"
export R2_BUCKET_NAME="leger-packages"

# Test publish script
./scripts/publish-rpm.sh
```

### [ ] GitHub Actions Test Release

```bash
# Create test tag (won't publish to R2, just builds)
git tag v0.0.1-test
git push origin v0.0.1-test
```

**Verify:**
1. Go to GitHub Actions tab
2. Watch "Release" workflow
3. Check all jobs succeed:
   - [ ] Build (amd64)
   - [ ] Build (arm64)
   - [ ] Create GitHub Release
4. Check RPMs are signed:
   - Download RPM from release
   - Run: `rpm --checksig leger-*.rpm`

### [ ] Production Release Test

```bash
# Create production release
git tag v0.1.0
git push origin v0.1.0
```

**Verify:**
1. GitHub Actions completes all jobs
2. GitHub Release is created with RPMs
3. R2 repository is updated:

```bash
# Check repository metadata
curl -I https://pkgs.leger.run/fedora/repodata/repomd.xml
# Should return 200 OK

# Check GPG key
curl https://pkgs.leger.run/fedora/repo.gpg | gpg --import
# Should import successfully

# Check repository config
curl https://pkgs.leger.run/fedora/leger.repo
# Should show repository configuration
```

## Phase 6: End-User Installation Test

### [ ] Test on Fedora/RHEL System

```bash
# Add repository
sudo dnf config-manager --add-repo https://pkgs.leger.run/fedora/leger.repo

# Refresh metadata
sudo dnf makecache

# Search for package
sudo dnf search leger

# Install
sudo dnf install leger

# Verify installation
leger --version
systemctl --user status legerd.service
```

### [ ] Verify GPG Signature Verification

```bash
# Should show GPG signature check passed
sudo dnf install -y leger
```

Look for: `GPG key signature verification passed`

## Phase 7: Documentation Updates

### [ ] Update Installation Documentation

Add to README.md or installation guide:

```markdown
## Installation

### Fedora / RHEL / Rocky Linux

```bash
sudo dnf config-manager --add-repo https://pkgs.leger.run/fedora/leger.repo
sudo dnf install leger
```
```

### [ ] Update Website

- [ ] Add installation instructions to https://leger.run
- [ ] Add supported distributions
- [ ] Link to documentation

### [ ] Announce Release

- [ ] GitHub Discussions/Announcements
- [ ] Social media
- [ ] Mailing list (if applicable)

## Ongoing Maintenance

### For Each New Release:

1. [ ] Commit changes to main branch
2. [ ] Create and push tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
3. [ ] Monitor GitHub Actions workflow
4. [ ] Verify GitHub Release is created
5. [ ] Verify R2 repository is updated
6. [ ] Test installation: `sudo dnf install --refresh leger`

### Quarterly:

- [ ] Rotate R2 API tokens
- [ ] Review R2 usage and costs
- [ ] Check for security updates to dependencies

### Annually:

- [ ] Consider rotating GPG key
- [ ] Review and update documentation
- [ ] Audit access controls

## Troubleshooting

### Workflow fails at "Sign RPM"

- Check `GPG_PRIVATE_KEY` secret is set correctly
- Verify key email matches `packages@leger.run`
- Review workflow logs for specific error

### Workflow fails at "Publish to R2"

- Verify all R2 secrets are set
- Check R2 bucket name and permissions
- Ensure R2 API token has write access

### Users can't install package

```bash
# On user's system, check:
curl -I https://pkgs.leger.run/fedora/repodata/repomd.xml
# Should return 200

# Import GPG key manually
sudo rpm --import https://pkgs.leger.run/fedora/repo.gpg

# Clear DNF cache
sudo dnf clean all
sudo dnf makecache
```

### Signature verification fails

- Ensure `repo.gpg` is accessible at repository URL
- Verify GPG key in `repo.gpg` matches signing key
- Check repository configuration has correct `gpgkey` URL

## Resources

- [Detailed Setup Guide](./rpm-distribution-setup.md)
- [Cloudflare R2 Dashboard](https://dash.cloudflare.com)
- [GitHub Repository Settings](https://github.com/leger-labs/leger/settings)
- [GitHub Actions](https://github.com/leger-labs/leger/actions)

## Status Tracking

**Setup Started:** _______________________
**GPG Key Generated:** _______________________
**R2 Bucket Created:** _______________________
**GitHub Secrets Added:** _______________________
**First Test Release:** _______________________
**First Production Release:** _______________________
**Setup Complete:** _______________________
