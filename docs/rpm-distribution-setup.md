# RPM Distribution Infrastructure Setup

This guide walks through setting up the complete RPM distribution infrastructure for Leger, including GPG signing, GitHub Actions automation, and Cloudflare R2 repository hosting.

## Overview

The distribution infrastructure consists of:

1. **GPG key pair** for signing RPM packages
2. **GitHub Actions workflow** for automated builds, signing, and publishing
3. **Cloudflare R2 bucket** for hosting the RPM repository
4. **Repository metadata** (repodata) for DNF/YUM integration
5. **Public repository configuration** for easy user installation

## Architecture

```
┌─────────────────┐
│  Git Tag Push   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│   GitHub Actions Workflow       │
│  ┌──────────────────────────┐  │
│  │ 1. Build (amd64 + arm64) │  │
│  └──────────┬───────────────┘  │
│             │                   │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │ 2. Sign RPMs with GPG    │  │
│  └──────────┬───────────────┘  │
│             │                   │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │ 3. Create GitHub Release │  │
│  └──────────┬───────────────┘  │
│             │                   │
│             ▼                   │
│  ┌──────────────────────────┐  │
│  │ 4. Publish to R2         │  │
│  │    - Upload RPMs         │  │
│  │    - Generate repodata   │  │
│  │    - Upload GPG key      │  │
│  └──────────┬───────────────┘  │
└─────────────┼───────────────────┘
              │
              ▼
     ┌────────────────────┐
     │  Cloudflare R2     │
     │  pkgs.leger.run    │
     │  ├── fedora/       │
     │      ├── x86_64/   │
     │      ├── aarch64/  │
     │      ├── repodata/ │
     │      ├── repo.gpg  │
     │      └── leger.repo│
     └────────────────────┘
              │
              ▼
     ┌────────────────────┐
     │  End Users         │
     │  dnf install leger │
     └────────────────────┘
```

## Step 1: Generate GPG Key Pair

Generate a GPG key pair for signing RPM packages:

```bash
./scripts/generate-gpg-key.sh
```

This will create:
- `leger-rpm-signing.private.asc` - Private key (keep secret!)
- `leger-rpm-signing.public.asc` - Public key (distribute to users)
- `leger-rpm-signing.keyid` - Key ID for reference

**Important:**
- Never commit the private key to git
- Add `*.private.asc` to `.gitignore`
- Store the private key securely

## Step 2: Set Up Cloudflare R2 Bucket

### 2.1 Create R2 Bucket

1. Log in to Cloudflare Dashboard
2. Navigate to R2 Object Storage
3. Click "Create bucket"
4. Name: `leger-packages` (or your preferred name)
5. Location: Auto (or choose closest to your users)
6. Click "Create bucket"

### 2.2 Create R2 API Token

1. In R2, go to "Manage R2 API Tokens"
2. Click "Create API token"
3. Name: `github-actions-rpm-publisher`
4. Permissions:
   - Object Read & Write
   - Bucket: `leger-packages`
5. Click "Create API Token"
6. **Save the credentials:**
   - Access Key ID
   - Secret Access Key
   - Endpoint URL (format: `https://<account-id>.r2.cloudflarestorage.com`)

### 2.3 Configure Custom Domain

1. In your R2 bucket settings, go to "Settings" → "Custom Domains"
2. Click "Connect Domain"
3. Enter: `pkgs.leger.run`
4. Follow the DNS setup instructions
5. Wait for DNS propagation (usually < 5 minutes)

### 2.4 Configure Bucket CORS (Optional)

If you want to allow browsers to fetch repository metadata:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Step 3: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret" for each:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `GPG_PRIVATE_KEY` | Contents of `leger-rpm-signing.private.asc` | Private GPG key for signing RPMs |
| `R2_ACCESS_KEY_ID` | From Step 2.2 | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | From Step 2.2 | R2 API token secret |
| `R2_ENDPOINT` | From Step 2.2 | R2 endpoint URL |
| `R2_BUCKET_NAME` | `leger-packages` | R2 bucket name |

**To add GPG_PRIVATE_KEY:**

```bash
# Display the private key
cat leger-rpm-signing.private.asc

# Copy the entire output including:
# -----BEGIN PGP PRIVATE KEY BLOCK-----
# ...
# -----END PGP PRIVATE KEY BLOCK-----
```

Paste the entire key (including headers) into the GitHub secret value.

## Step 4: Test the Workflow

### 4.1 Local Testing

Test building and signing locally:

```bash
# Build RPMs
make rpm-all

# Sign RPMs (requires GPG key in keyring)
make sign GPG_KEY=packages@leger.run

# Verify signatures
make verify

# Test publishing (requires R2 credentials)
export R2_ACCESS_KEY_ID="your-key"
export R2_SECRET_ACCESS_KEY="your-secret"
export R2_ENDPOINT="https://your-account.r2.cloudflarestorage.com"
export R2_BUCKET_NAME="leger-packages"
./scripts/publish-rpm.sh
```

### 4.2 Test GitHub Actions

Create a test tag:

```bash
git tag v0.0.1-test
git push origin v0.0.1-test
```

This will trigger the workflow but won't publish to R2 (pre-release tags are skipped).

Monitor the workflow:
1. Go to GitHub Actions tab
2. Watch the "Release" workflow
3. Check all jobs complete successfully

### 4.3 First Production Release

When ready for production:

```bash
git tag v0.1.0
git push origin v0.1.0
```

This will:
1. Build RPMs for amd64 and arm64
2. Sign them with GPG
3. Create a GitHub Release
4. Publish to R2 repository

## Step 5: Verify Repository

After the first release, verify the repository is working:

```bash
# Check repository is accessible
curl -I https://pkgs.leger.run/fedora/repodata/repomd.xml

# Check GPG key is available
curl https://pkgs.leger.run/fedora/repo.gpg

# Check repository configuration
curl https://pkgs.leger.run/fedora/leger.repo

# Test installation on a Fedora/RHEL system
sudo dnf config-manager --add-repo https://pkgs.leger.run/fedora/leger.repo
sudo dnf makecache
sudo dnf search leger
sudo dnf install leger
```

## Step 6: User Installation Instructions

Update your documentation with these installation instructions:

### Quick Install

```bash
# Add repository
sudo dnf config-manager --add-repo https://pkgs.leger.run/fedora/leger.repo

# Install
sudo dnf install leger
```

### Manual Repository Setup

Create `/etc/yum.repos.d/leger.repo`:

```ini
[leger-stable]
name=Leger Stable Repository
baseurl=https://pkgs.leger.run/fedora/$basearch
enabled=1
gpgcheck=1
gpgkey=https://pkgs.leger.run/fedora/repo.gpg
repo_gpgcheck=1
metadata_expire=1h
```

Then install:

```bash
sudo dnf install leger
```

## Maintenance

### Updating the Repository

The repository updates automatically on each release. When you push a new tag:

1. GitHub Actions builds and signs new RPMs
2. The publish job downloads existing repository
3. Adds new RPMs
4. Updates repository metadata
5. Uploads everything to R2

Users will see updates within their configured metadata expiry time (default: 1 hour).

### Rotating GPG Keys

If you need to rotate GPG keys:

1. Generate new key: `./scripts/generate-gpg-key.sh`
2. Update `GPG_PRIVATE_KEY` GitHub secret
3. Keep old public key available for old packages
4. Next release will be signed with new key

### Troubleshooting

**RPMs not signed:**
- Check `GPG_PRIVATE_KEY` secret is set correctly
- Verify key email is `packages@leger.run`
- Check workflow logs for signing step

**Repository not updating:**
- Check R2 credentials in GitHub secrets
- Verify R2 bucket permissions
- Check publish job logs

**Users can't verify signatures:**
- Ensure `repo.gpg` is accessible
- Check GPG key was exported correctly
- Verify repository configuration has correct `gpgkey` URL

**DNF cache issues:**
```bash
# Clear cache
sudo dnf clean all
sudo dnf makecache

# Force refresh
sudo dnf --refresh search leger
```

## Cost Considerations

### Cloudflare R2 Pricing (as of 2024)

- **Storage:** $0.015/GB/month
- **Class A operations** (writes): $4.50/million
- **Class B operations** (reads): $0.36/million
- **Egress:** FREE (this is the big win vs S3!)

### Estimated Costs for Leger

Assuming:
- 2 RPMs per release (amd64 + arm64) × ~20 MB each = 40 MB
- 12 releases per year
- 10,000 downloads per release

**Monthly costs:**
- Storage: ~0.5 GB × $0.015 = $0.0075
- Writes: ~50 operations × $4.50/1M = $0.0002
- Reads: ~120,000 operations × $0.36/1M = $0.04

**Total: ~$0.05/month or $0.60/year**

Much cheaper than GitHub LFS or other alternatives!

## Security Best Practices

1. **GPG Key Management:**
   - Use a strong passphrase (or no passphrase for CI/CD)
   - Store private key in GitHub Secrets only
   - Rotate keys annually
   - Keep offline backup of private key

2. **R2 API Tokens:**
   - Use minimal permissions (read/write to specific bucket only)
   - Rotate tokens every 90 days
   - Monitor token usage in Cloudflare dashboard

3. **Repository Security:**
   - Always sign RPMs (`gpgcheck=1`)
   - Enable repo metadata signature checking (`repo_gpgcheck=1`)
   - Use HTTPS for all repository URLs

## References

- [nfpm Documentation](https://nfpm.goreleaser.com/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [RPM Packaging Guide](https://rpm-packaging-guide.github.io/)
- [createrepo_c Documentation](https://github.com/rpm-software-management/createrepo_c)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## Support

For issues with the distribution infrastructure:
- GitHub Issues: https://github.com/leger-labs/leger/issues
- Email: packages@leger.run
- Documentation: https://leger.run/docs/
