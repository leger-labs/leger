#!/bin/bash
# Publish RPM packages to Cloudflare R2 repository
# Creates/updates repository metadata and syncs to R2

set -e

# Configuration from environment
: "${R2_ACCESS_KEY_ID:?ERROR: R2_ACCESS_KEY_ID not set}"
: "${R2_SECRET_ACCESS_KEY:?ERROR: R2_SECRET_ACCESS_KEY not set}"
: "${R2_ENDPOINT:?ERROR: R2_ENDPOINT not set}"
: "${R2_BUCKET_NAME:?ERROR: R2_BUCKET_NAME not set}"
: "${PUBLIC_URL:=https://pkgs.leger.run}"
: "${RPMS_DIR:=./rpms}"
: "${FEDORA_VERSION:=42}"

# Directories
WORK_DIR=$(mktemp -d)
REPO_DIR="${WORK_DIR}/repo"
trap 'rm -rf "${WORK_DIR}"' EXIT

echo "🚀 Publishing RPMs to Cloudflare R2..."
echo ""
echo "Configuration:"
echo "  Bucket:      ${R2_BUCKET_NAME}"
echo "  Endpoint:    ${R2_ENDPOINT}"
echo "  Public URL:  ${PUBLIC_URL}"
echo "  RPMs Dir:    ${RPMS_DIR}"
echo "  Fedora:      ${FEDORA_VERSION}"
echo ""

# Check for required tools
for cmd in createrepo_c aws; do
    if ! command -v $cmd &> /dev/null; then
        echo "❌ ERROR: $cmd not found. Please install it."
        exit 1
    fi
done

# Configure AWS CLI for R2
export AWS_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="auto"

# S3-compatible endpoint for R2
AWS_S3_OPTS=(
    --endpoint-url "${R2_ENDPOINT}"
    --region auto
)

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p "${REPO_DIR}/fedora/${FEDORA_VERSION}/x86_64"
mkdir -p "${REPO_DIR}/fedora/${FEDORA_VERSION}/aarch64"
mkdir -p "${REPO_DIR}/fedora/${FEDORA_VERSION}/SRPMS"

# Download existing repository (if it exists)
echo ""
echo "📥 Downloading existing repository metadata..."
for arch in x86_64 aarch64; do
    echo "  Checking ${arch}..."
    if aws s3 ls "${AWS_S3_OPTS[@]}" \
        "s3://${R2_BUCKET_NAME}/fedora/${FEDORA_VERSION}/${arch}/repodata/" 2>/dev/null; then
        
        echo "    Found existing metadata, downloading..."
        aws s3 sync "${AWS_S3_OPTS[@]}" \
            --quiet \
            "s3://${R2_BUCKET_NAME}/fedora/${FEDORA_VERSION}/${arch}/" \
            "${REPO_DIR}/fedora/${FEDORA_VERSION}/${arch}/" || true
    else
        echo "    No existing metadata found (this is OK for first release)"
    fi
done

# Copy new RPMs to repository
echo ""
echo "📦 Organizing RPMs by architecture..."
if [ -d "${RPMS_DIR}" ]; then
    find "${RPMS_DIR}" -name "*.x86_64.rpm" -exec cp -v {} "${REPO_DIR}/fedora/${FEDORA_VERSION}/x86_64/" \;
    find "${RPMS_DIR}" -name "*.aarch64.rpm" -exec cp -v {} "${REPO_DIR}/fedora/${FEDORA_VERSION}/aarch64/" \;
    find "${RPMS_DIR}" -name "*.src.rpm" -exec cp -v {} "${REPO_DIR}/fedora/${FEDORA_VERSION}/SRPMS/" \; || true
else
    echo "⚠️  WARNING: ${RPMS_DIR} not found, skipping RPM copy"
fi

# List what we're publishing
echo ""
echo "📋 Packages to publish:"
echo ""
echo "x86_64:"
ls -lh "${REPO_DIR}/fedora/${FEDORA_VERSION}/x86_64/" 2>/dev/null || echo "  (none)"
echo ""
echo "aarch64:"
ls -lh "${REPO_DIR}/fedora/${FEDORA_VERSION}/aarch64/" 2>/dev/null || echo "  (none)"
echo ""

# Create/update repository metadata
echo "🔧 Creating repository metadata..."
for arch in x86_64 aarch64; do
    ARCH_DIR="${REPO_DIR}/fedora/${FEDORA_VERSION}/${arch}"
    if [ -n "$(ls -A ${ARCH_DIR}/*.rpm 2>/dev/null)" ]; then
        echo "  Processing ${arch}..."
        createrepo_c \
            --update \
            --simple-md-filenames \
            --revision "${GITHUB_SHA:-$(date +%s)}" \
            "${ARCH_DIR}"
    else
        echo "  Skipping ${arch} (no RPMs)"
    fi
done

# Create repository configuration file
echo ""
echo "📝 Creating repository configuration..."
cat > "${REPO_DIR}/leger.repo" <<EOF
[leger]
name=leger - Podman Quadlet Manager
baseurl=${PUBLIC_URL}/fedora/\$releasever/\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=${PUBLIC_URL}/RPM-GPG-KEY-leger
metadata_expire=1h
EOF

# Copy GPG public key if it exists
if [ -f "leger-rpm-signing.public.asc" ]; then
    echo "🔑 Copying GPG public key..."
    cp "leger-rpm-signing.public.asc" "${REPO_DIR}/RPM-GPG-KEY-leger"
elif [ -f "RPM-GPG-KEY-leger" ]; then
    echo "🔑 Copying GPG public key..."
    cp "RPM-GPG-KEY-leger" "${REPO_DIR}/RPM-GPG-KEY-leger"
else
    echo "⚠️  WARNING: No GPG public key found (leger-rpm-signing.public.asc or RPM-GPG-KEY-leger)"
fi

# Create index.html
echo "📄 Creating repository homepage..."
cat > "${REPO_DIR}/index.html" <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>leger Package Repository</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
            color: #333;
        }
        pre {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: "SF Mono", Monaco, "Courier New", monospace;
        }
        h1 { color: #2c3e50; margin-top: 0; }
        h2 { color: #34495e; margin-top: 2rem; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .highlight { background: #fff3cd; padding: 0.2rem 0.4rem; }
    </style>
</head>
<body>
    <h1>🐳 leger Package Repository</h1>
    <p>Official RPM repository for <strong>leger</strong> - Podman Quadlet Manager</p>
    
    <h2>Quick Install (Fedora 42+)</h2>
    <pre><code>sudo dnf config-manager --add-repo https://pkgs.leger.run/leger.repo
sudo dnf install leger</code></pre>
    
    <h2>Manual Setup</h2>
    <p>Create <code>/etc/yum.repos.d/leger.repo</code>:</p>
    <pre><code>[leger]
name=leger - Podman Quadlet Manager
baseurl=https://pkgs.leger.run/fedora/$releasever/$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://pkgs.leger.run/RPM-GPG-KEY-leger
metadata_expire=1h</code></pre>
    
    <p>Then install:</p>
    <pre><code>sudo dnf install leger</code></pre>
    
    <h2>Supported Platforms</h2>
    <ul>
        <li><strong>Fedora</strong> 42+</li>
        <li><strong>Architectures:</strong> x86_64, aarch64</li>
    </ul>
    
    <h2>Package Contents</h2>
    <ul>
        <li><code>/usr/bin/leger</code> - Interactive CLI tool</li>
        <li><code>/usr/bin/legerd</code> - Background daemon</li>
        <li><code>/etc/leger/config.yaml</code> - Configuration file</li>
        <li><code>/etc/default/legerd</code> - Environment variables</li>
        <li>Systemd services (user and system scope)</li>
    </ul>
    
    <h2>Getting Started</h2>
    <p>After installation:</p>
    <pre><code># Verify installation
leger --version
legerd --version

# Configure
sudo vim /etc/leger/config.yaml

# Start daemon (user service)
systemctl --user enable --now legerd.service

# Or start system-wide
sudo systemctl enable --now legerd.service

# Check status
systemctl --user status legerd.service</code></pre>
    
    <h2>Documentation</h2>
    <ul>
        <li><a href="https://github.com/leger-labs/leger">GitHub Repository</a></li>
        <li><a href="https://github.com/leger-labs/leger/blob/main/README.md">README</a></li>
        <li><a href="https://github.com/leger-labs/leger/releases">Releases</a></li>
    </ul>
    
    <h2>Support</h2>
    <p>Issues? <a href="https://github.com/leger-labs/leger/issues">Report on GitHub</a></p>
    
    <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
    <p style="text-align: center; color: #7f8c8d; font-size: 0.9rem;">
        Hosted on Cloudflare R2 • Updated automatically on each release
    </p>
</body>
</html>
EOF

# Upload to R2
echo ""
echo "☁️  Uploading to Cloudflare R2..."
aws s3 sync "${AWS_S3_OPTS[@]}" \
    --delete \
    --exclude ".DS_Store" \
    "${REPO_DIR}/" \
    "s3://${R2_BUCKET_NAME}/"

echo ""
echo "✅ Repository published successfully!"
echo ""
echo "Repository URLs:"
echo "  Homepage:   ${PUBLIC_URL}"
echo "  Repo file:  ${PUBLIC_URL}/leger.repo"
echo "  GPG key:    ${PUBLIC_URL}/RPM-GPG-KEY-leger"
echo "  x86_64:     ${PUBLIC_URL}/fedora/${FEDORA_VERSION}/x86_64/"
echo "  aarch64:    ${PUBLIC_URL}/fedora/${FEDORA_VERSION}/aarch64/"
echo ""
echo "Users can now install with:"
echo "  sudo dnf config-manager --add-repo ${PUBLIC_URL}/leger.repo"
echo "  sudo dnf install leger"
echo ""
