#!/bin/bash
# Generate GPG key for signing RPM packages
# This script creates a GPG key pair for the Leger package repository

set -euo pipefail

# Configuration
KEY_TYPE="RSA"
KEY_LENGTH="4096"
KEY_USAGE="sign"
KEY_NAME="Leger Package Signing"
KEY_EMAIL="packages@leger.run"
KEY_COMMENT="RPM package signing key"
KEY_EXPIRE="0"  # Never expire

# Output files
PRIVATE_KEY_FILE="leger-rpm-signing.private.asc"
PUBLIC_KEY_FILE="leger-rpm-signing.public.asc"
KEY_ID_FILE="leger-rpm-signing.keyid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if GPG is installed
if ! command -v gpg &> /dev/null; then
    echo -e "${RED}Error: gpg is not installed${NC}"
    echo "Install it with: sudo dnf install gnupg2"
    exit 1
fi

# Check if rpm-sign is installed (needed for signing)
if ! command -v rpmsign &> /dev/null; then
    echo -e "${YELLOW}Warning: rpm-sign is not installed${NC}"
    echo "You'll need it later for signing. Install with: sudo dnf install rpm-sign"
fi

echo -e "${GREEN}Generating GPG key for RPM signing...${NC}"
echo ""
echo "Key details:"
echo "  Name:    $KEY_NAME"
echo "  Email:   $KEY_EMAIL"
echo "  Comment: $KEY_COMMENT"
echo "  Type:    $KEY_TYPE $KEY_LENGTH"
echo "  Expires: Never"
echo ""

# Generate passphrase-less key for CI/CD
# In production, you might want a passphrase for security
cat > /tmp/gpg-key-config <<EOF
%echo Generating RPM signing key
Key-Type: $KEY_TYPE
Key-Length: $KEY_LENGTH
Key-Usage: $KEY_USAGE
Name-Real: $KEY_NAME
Name-Comment: $KEY_COMMENT
Name-Email: $KEY_EMAIL
Expire-Date: $KEY_EXPIRE
%no-protection
%commit
%echo Done
EOF

echo -e "${YELLOW}Generating key (this may take a minute)...${NC}"
gpg --batch --generate-key /tmp/gpg-key-config

# Get the key ID
KEY_ID=$(gpg --list-keys --with-colons "$KEY_EMAIL" | awk -F: '/^pub:/ {print $5}')

if [ -z "$KEY_ID" ]; then
    echo -e "${RED}Error: Failed to generate key${NC}"
    rm -f /tmp/gpg-key-config
    exit 1
fi

echo -e "${GREEN}Key generated successfully!${NC}"
echo "Key ID: $KEY_ID"
echo ""

# Export private key (for CI/CD secrets)
echo "Exporting private key..."
gpg --armor --export-secret-keys "$KEY_EMAIL" > "$PRIVATE_KEY_FILE"

# Export public key (for repository)
echo "Exporting public key..."
gpg --armor --export "$KEY_EMAIL" > "$PUBLIC_KEY_FILE"

# Save key ID
echo "$KEY_ID" > "$KEY_ID_FILE"

# Cleanup
rm -f /tmp/gpg-key-config

echo ""
echo -e "${GREEN}GPG key pair created successfully!${NC}"
echo ""
echo "Files created:"
echo "  Private key: $PRIVATE_KEY_FILE (keep this SECRET!)"
echo "  Public key:  $PUBLIC_KEY_FILE (distribute this)"
echo "  Key ID:      $KEY_ID_FILE"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Add private key to GitHub Secrets:"
echo "   - Name: GPG_PRIVATE_KEY"
echo "   - Value: Contents of $PRIVATE_KEY_FILE"
echo ""
echo "2. Add passphrase to GitHub Secrets (if you used one):"
echo "   - Name: GPG_PASSPHRASE"
echo "   - Value: Your passphrase (empty for this key)"
echo ""
echo "3. Upload public key to your R2 bucket:"
echo "   - File: $PUBLIC_KEY_FILE"
echo "   - Upload to: https://pkgs.leger.run/fedora/repo.gpg"
echo ""
echo "4. To sign RPMs locally:"
echo "   make sign GPG_KEY=$KEY_EMAIL"
echo ""
echo -e "${RED}IMPORTANT: Keep $PRIVATE_KEY_FILE secure and never commit it to git!${NC}"
echo ""
