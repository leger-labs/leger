#!/bin/bash
# Generate GPG key pair for signing RPM packages
# Based on Tailscale's approach but simplified for leger

set -e

# Configuration
KEY_EMAIL="packages@leger.run"
KEY_NAME="leger Package Signing"
KEY_TYPE="RSA"
KEY_LENGTH="4096"
KEY_EXPIRE="0"  # Never expires (for CI/CD automation)

# Output files
PRIVATE_KEY_FILE="leger-rpm-signing.private.asc"
PUBLIC_KEY_FILE="leger-rpm-signing.public.asc"
KEYID_FILE="leger-rpm-signing.keyid"

echo "🔐 Generating GPG key pair for leger RPM signing..."
echo ""
echo "Configuration:"
echo "  Email:      ${KEY_EMAIL}"
echo "  Name:       ${KEY_NAME}"
echo "  Key Type:   ${KEY_TYPE} ${KEY_LENGTH}"
echo "  Expiration: ${KEY_EXPIRE} (never)"
echo ""

# Check if key already exists
if gpg --list-keys "${KEY_EMAIL}" >/dev/null 2>&1; then
    echo "⚠️  WARNING: Key for ${KEY_EMAIL} already exists!"
    echo ""
    read -p "Do you want to delete the existing key and create a new one? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Deleting existing key..."
        KEY_ID=$(gpg --list-keys --with-colons "${KEY_EMAIL}" | awk -F: '/^pub:/ {print $5}')
        gpg --batch --yes --delete-secret-keys "${KEY_ID}" 2>/dev/null || true
        gpg --batch --yes --delete-keys "${KEY_ID}" 2>/dev/null || true
    else
        echo "Aborting. Using existing key..."
        exit 0
    fi
fi

# Generate key using batch mode
echo "Generating key (this may take a minute)..."
gpg --batch --generate-key <<EOF
Key-Type: ${KEY_TYPE}
Key-Length: ${KEY_LENGTH}
Subkey-Type: ${KEY_TYPE}
Subkey-Length: ${KEY_LENGTH}
Name-Real: ${KEY_NAME}
Name-Email: ${KEY_EMAIL}
Expire-Date: ${KEY_EXPIRE}
%no-protection
%commit
EOF

echo ""
echo "✅ Key generated successfully!"
echo ""

# Get the key ID
KEY_ID=$(gpg --list-keys --with-colons "${KEY_EMAIL}" | awk -F: '/^pub:/ {print $5}')
echo "Key ID: ${KEY_ID}"
echo "${KEY_ID}" > "${KEYID_FILE}"

# Export public key
echo ""
echo "📤 Exporting public key to ${PUBLIC_KEY_FILE}..."
gpg --armor --export "${KEY_EMAIL}" > "${PUBLIC_KEY_FILE}"

# Export private key
echo "📤 Exporting private key to ${PRIVATE_KEY_FILE}..."
gpg --armor --export-secret-keys "${KEY_EMAIL}" > "${PRIVATE_KEY_FILE}"

echo ""
echo "✅ Export complete!"
echo ""
echo "Files created:"
echo "  📄 ${PUBLIC_KEY_FILE}  (distribute to users)"
echo "  🔒 ${PRIVATE_KEY_FILE} (KEEP SECRET! Store in GitHub Secrets)"
echo "  🆔 ${KEYID_FILE}       (key ID reference)"
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo "  1. NEVER commit ${PRIVATE_KEY_FILE} to git!"
echo "  2. Add '*.private.asc' to .gitignore"
echo "  3. Store private key in GitHub Secrets as GPG_PRIVATE_KEY"
echo "  4. Backup private key to secure location (password manager, encrypted drive)"
echo ""
echo "Next steps:"
echo "  1. Backup ${PRIVATE_KEY_FILE} securely"
echo "  2. Add to GitHub Secrets:"
echo "     cat ${PRIVATE_KEY_FILE}"
echo "     # Copy output to GitHub Secrets > GPG_PRIVATE_KEY"
echo "  3. Commit public key to git:"
echo "     git add ${PUBLIC_KEY_FILE}"
echo "     git commit -m 'Add RPM signing public key'"
echo "  4. Securely delete private key from disk:"
echo "     shred -u ${PRIVATE_KEY_FILE}"
echo ""
