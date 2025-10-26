#!/bin/bash
# Publish RPMs to Cloudflare R2 with proper DNF repository structure
# This script is called by .github/workflows/release.yml

set -euo pipefail

# ============================================================================
# Configuration from GitHub Actions environment
# ============================================================================
R2_ENDPOINT="${R2_ENDPOINT}"
R2_BUCKET_NAME="${R2_BUCKET_NAME}"
R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"
PUBLIC_URL="${PUBLIC_URL:-https://pkgs.leger.run}"
RPMS_DIR="${RPMS_DIR:-./rpms}"

# ============================================================================
# AWS CLI configuration for R2
# ============================================================================
export AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="auto"
AWS_ENDPOINT_URL="${R2_ENDPOINT}"

# ============================================================================
# Setup
# ============================================================================
REPO_ROOT="fedora"
TEMP_DIR=$(mktemp -d)
trap "rm -rf ${TEMP_DIR}" EXIT

echo "=================================================="
echo "Publishing RPMs to R2 Repository"
echo "=================================================="
echo "Bucket: ${R2_BUCKET_NAME}"
echo "Endpoint: ${R2_ENDPOINT}"
echo "Public URL: ${PUBLIC_URL}/${REPO_ROOT}"
echo "Source: ${RPMS_DIR}"
echo ""

# ============================================================================
# Create architecture-specific directory structure
# ============================================================================
echo "Creating directory structure..."
mkdir -p "${TEMP_DIR}/${REPO_ROOT}/x86_64"
mkdir -p "${TEMP_DIR}/${REPO_ROOT}/aarch64"
echo "  ✅ Created x86_64/ and aarch64/ directories"
echo ""

# ============================================================================
# Organize RPMs by architecture
# ============================================================================
echo "Organizing RPMs by architecture..."
rpm_count=0

if [ ! -d "${RPMS_DIR}" ]; then
    echo "❌ ERROR: RPMS_DIR does not exist: ${RPMS_DIR}"
    exit 1
fi

for rpm in "${RPMS_DIR}"/*.rpm; do
    if [ -f "$rpm" ]; then
        filename=$(basename "$rpm")
        echo "  Processing: $filename"

        # Determine architecture from filename
        if [[ "$filename" == *"x86_64.rpm" ]]; then
            cp "$rpm" "${TEMP_DIR}/${REPO_ROOT}/x86_64/"
            echo "    → Copied to x86_64/"
            ((rpm_count++))
        elif [[ "$filename" == *"aarch64.rpm" ]]; then
            cp "$rpm" "${TEMP_DIR}/${REPO_ROOT}/aarch64/"
            echo "    → Copied to aarch64/"
            ((rpm_count++))
        elif [[ "$filename" == *"noarch.rpm" ]]; then
            # Copy noarch packages to both architectures
            cp "$rpm" "${TEMP_DIR}/${REPO_ROOT}/x86_64/"
            cp "$rpm" "${TEMP_DIR}/${REPO_ROOT}/aarch64/"
            echo "    → Copied to both architectures (noarch)"
            ((rpm_count+=2))
        else
            echo "    ⚠️  Unknown architecture, skipping"
        fi
    fi
done

if [ $rpm_count -eq 0 ]; then
    echo "❌ ERROR: No RPMs found in ${RPMS_DIR}"
    exit 1
fi

echo "  ✅ Organized $rpm_count RPM file(s)"
echo ""

# ============================================================================
# Create repository metadata for each architecture
# ============================================================================
echo "Creating repository metadata..."
for arch in x86_64 aarch64; do
    arch_dir="${TEMP_DIR}/${REPO_ROOT}/${arch}"

    if [ -d "$arch_dir" ] && compgen -G "$arch_dir/*.rpm" > /dev/null; then
        echo "  Creating metadata for ${arch}..."
        createrepo_c --update "$arch_dir" 2>&1 | grep -v "^Spawning worker"
        echo "    ✅ Metadata created for ${arch}"
    else
        echo "  ⚠️  No RPMs found for ${arch}, skipping metadata"
    fi
done
echo ""

# ============================================================================
# Create repository configuration file
# ============================================================================
echo "Creating leger.repo file..."
cat > "${TEMP_DIR}/${REPO_ROOT}/leger.repo" <<EOF
[leger]
name=Leger Packages
baseurl=${PUBLIC_URL}/${REPO_ROOT}/\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=${PUBLIC_URL}/${REPO_ROOT}/repo.gpg
metadata_expire=1h
EOF
echo "  ✅ leger.repo created with \$basearch in baseurl"
echo ""

# ============================================================================
# Copy GPG public key
# ============================================================================
echo "Adding GPG public key..."
if [ -f "leger-rpm-signing.public.asc" ]; then
    cp "leger-rpm-signing.public.asc" "${TEMP_DIR}/${REPO_ROOT}/repo.gpg"
    echo "  ✅ GPG key copied as repo.gpg"
else
    echo "  ⚠️  WARNING: leger-rpm-signing.public.asc not found"
    echo "     Repository will not be verifiable without GPG key"
fi
echo ""

# ============================================================================
# Show final structure
# ============================================================================
echo "Final repository structure:"
find "${TEMP_DIR}/${REPO_ROOT}" -type f -o -type d | sed "s|${TEMP_DIR}/||" | sort
echo ""

# ============================================================================
# Upload to R2
# ============================================================================
echo "Uploading to R2 bucket..."
echo "  Syncing ${TEMP_DIR}/${REPO_ROOT}/ → s3://${R2_BUCKET_NAME}/${REPO_ROOT}/"
echo ""

aws s3 sync "${TEMP_DIR}/${REPO_ROOT}/" \
    "s3://${R2_BUCKET_NAME}/${REPO_ROOT}/" \
    --endpoint-url="${AWS_ENDPOINT_URL}" \
    --delete \
    --acl public-read \
    --no-progress

echo ""
echo "=================================================="
echo "✅ Repository Published Successfully"
echo "=================================================="
echo ""
echo "Repository URL: ${PUBLIC_URL}/${REPO_ROOT}"
echo ""
echo "Installation instructions:"
echo "  sudo dnf config-manager --add-repo ${PUBLIC_URL}/${REPO_ROOT}/leger.repo"
echo "  sudo dnf install leger"
echo ""
echo "Repository structure:"
echo "  ${PUBLIC_URL}/${REPO_ROOT}/x86_64/    - x86_64 RPMs"
echo "  ${PUBLIC_URL}/${REPO_ROOT}/aarch64/   - aarch64 RPMs"
echo "  ${PUBLIC_URL}/${REPO_ROOT}/repo.gpg   - GPG public key"
echo "  ${PUBLIC_URL}/${REPO_ROOT}/leger.repo - Repository config"
echo ""
