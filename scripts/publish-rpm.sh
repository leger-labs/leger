#!/bin/bash
# Publish RPM packages to Cloudflare R2 and generate repository metadata
# This script handles the complete publishing pipeline:
# 1. Upload RPM files to R2
# 2. Generate/update RPM repository metadata (repodata)
# 3. Upload public GPG key
# 4. Upload repository configuration file

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="${R2_BUCKET_NAME:-leger-packages}"
BUCKET_ENDPOINT="${R2_ENDPOINT:-https://your-account-id.r2.cloudflarestorage.com}"
PUBLIC_URL="${PUBLIC_URL:-https://pkgs.leger.run}"
ARCH="${ARCH:-x86_64}"  # Can be x86_64 or aarch64

# Directories
RPMS_DIR="${RPMS_DIR:-./rpms}"
TEMP_DIR=$(mktemp -d)

# Cleanup on exit
trap 'rm -rf "$TEMP_DIR"' EXIT

# Check required environment variables
check_requirements() {
    local missing=0

    if [ -z "${R2_ACCESS_KEY_ID:-}" ]; then
        echo -e "${RED}Error: R2_ACCESS_KEY_ID not set${NC}"
        missing=1
    fi

    if [ -z "${R2_SECRET_ACCESS_KEY:-}" ]; then
        echo -e "${RED}Error: R2_SECRET_ACCESS_KEY not set${NC}"
        missing=1
    fi

    if ! command -v aws &> /dev/null; then
        echo -e "${RED}Error: AWS CLI not installed${NC}"
        echo "Install it with: pip install awscli"
        missing=1
    fi

    if ! command -v createrepo_c &> /dev/null; then
        echo -e "${RED}Error: createrepo_c not installed${NC}"
        echo "Install it with: sudo dnf install createrepo_c"
        missing=1
    fi

    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Configure AWS CLI for R2
configure_s3() {
    export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
    export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
    export AWS_DEFAULT_REGION="auto"
}

# Upload file to R2
s3_upload() {
    local src="$1"
    local dst="$2"

    echo -e "${BLUE}Uploading $src -> $dst${NC}"
    aws s3 cp "$src" "s3://${BUCKET_NAME}/${dst}" \
        --endpoint-url "$BUCKET_ENDPOINT" \
        --no-progress
}

# Download directory from R2
s3_download_dir() {
    local remote="$1"
    local local="$2"

    echo -e "${BLUE}Downloading $remote -> $local${NC}"
    aws s3 sync "s3://${BUCKET_NAME}/${remote}" "$local" \
        --endpoint-url "$BUCKET_ENDPOINT" \
        --no-progress 2>/dev/null || true
}

# Upload directory to R2
s3_upload_dir() {
    local local="$1"
    local remote="$2"

    echo -e "${BLUE}Uploading $local -> $remote${NC}"
    aws s3 sync "$local" "s3://${BUCKET_NAME}/${remote}" \
        --endpoint-url "$BUCKET_ENDPOINT" \
        --no-progress
}

# Main publishing flow
main() {
    echo -e "${GREEN}=== Publishing RPMs to R2 ===${NC}"
    echo ""

    # Check requirements
    check_requirements
    configure_s3

    # Create working directory
    local REPO_DIR="$TEMP_DIR/fedora"
    mkdir -p "$REPO_DIR"

    # Download existing repository metadata (if any)
    echo -e "${YELLOW}Downloading existing repository metadata...${NC}"
    s3_download_dir "fedora" "$REPO_DIR"

    # Copy new RPMs to repository
    echo -e "${YELLOW}Adding new RPMs...${NC}"
    if [ -d "$RPMS_DIR" ]; then
        for rpm in "$RPMS_DIR"/*.rpm; do
            if [ -f "$rpm" ]; then
                cp -v "$rpm" "$REPO_DIR/"
            fi
        done
    else
        echo -e "${RED}Error: RPMs directory not found: $RPMS_DIR${NC}"
        exit 1
    fi

    # Generate repository metadata
    echo -e "${YELLOW}Generating repository metadata...${NC}"
    if [ -f "$REPO_DIR/repodata/repomd.xml" ]; then
        # Update existing repo
        createrepo_c --update "$REPO_DIR"
    else
        # Create new repo
        createrepo_c "$REPO_DIR"
    fi

    # Upload public GPG key if it exists
    if [ -f "leger-rpm-signing.public.asc" ]; then
        echo -e "${YELLOW}Uploading GPG public key...${NC}"
        s3_upload "leger-rpm-signing.public.asc" "fedora/repo.gpg"
    fi

    # Upload repository configuration file if it exists
    if [ -f "packaging/leger.repo" ]; then
        echo -e "${YELLOW}Uploading repository configuration...${NC}"
        s3_upload "packaging/leger.repo" "fedora/leger.repo"
    fi

    # Upload everything to R2
    echo -e "${YELLOW}Uploading repository to R2...${NC}"
    s3_upload_dir "$REPO_DIR" "fedora"

    echo ""
    echo -e "${GREEN}=== Publishing complete! ===${NC}"
    echo ""
    echo "Repository URL: $PUBLIC_URL/fedora"
    echo ""
    echo "Users can install with:"
    echo -e "${BLUE}sudo dnf config-manager --add-repo $PUBLIC_URL/fedora/leger.repo${NC}"
    echo -e "${BLUE}sudo dnf install leger${NC}"
    echo ""
}

# Parse arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Publish RPM packages to Cloudflare R2 bucket"
        echo ""
        echo "Required environment variables:"
        echo "  R2_ACCESS_KEY_ID      - R2 access key"
        echo "  R2_SECRET_ACCESS_KEY  - R2 secret key"
        echo ""
        echo "Optional environment variables:"
        echo "  R2_BUCKET_NAME        - Bucket name (default: leger-packages)"
        echo "  R2_ENDPOINT           - R2 endpoint URL"
        echo "  PUBLIC_URL            - Public URL for repository (default: https://pkgs.leger.run)"
        echo "  RPMS_DIR              - Directory containing RPMs (default: ./rpms)"
        echo ""
        echo "Example:"
        echo "  export R2_ACCESS_KEY_ID=xxx"
        echo "  export R2_SECRET_ACCESS_KEY=yyy"
        echo "  export R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com"
        echo "  $0"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
