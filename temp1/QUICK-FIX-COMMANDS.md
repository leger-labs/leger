# Quick Fix Commands

## 🚀 Copy these commands to fix your leger project

### Step 1: Navigate to your project
```bash
cd /path/to/leger
```

### Step 2: Backup existing files (optional but recommended)
```bash
mkdir -p .backup-$(date +%Y%m%d)
cp nfpm.yaml .backup-$(date +%Y%m%d)/ 2>/dev/null || true
cp Makefile .backup-$(date +%Y%m%d)/ 2>/dev/null || true
```

### Step 3: Create missing directories
```bash
mkdir -p scripts
mkdir -p packaging
mkdir -p systemd
mkdir -p release/rpm
mkdir -p config
```

### Step 4: Download fixed files from Claude outputs
```bash
# If files are in /mnt/user-data/outputs/
cp /mnt/user-data/outputs/nfpm.yaml .
cp /mnt/user-data/outputs/Makefile .
cp /mnt/user-data/outputs/scripts/generate-gpg-key.sh scripts/
cp /mnt/user-data/outputs/scripts/publish-rpm.sh scripts/
cp /mnt/user-data/outputs/packaging/leger.repo packaging/

# Make scripts executable
chmod +x scripts/*.sh

# Add .gitignore entries
cat /mnt/user-data/outputs/.gitignore-additions >> .gitignore
```

### Step 5: Verify files were copied
```bash
ls -l nfpm.yaml Makefile
ls -l scripts/
ls -l packaging/
```

### Step 6: Check module path consistency
```bash
# Should all show: github.com/leger-labs/leger
grep "MODULE :=" Makefile
grep "module" go.mod
grep "github.com/leger-labs/leger" .github/workflows/release.yml
```

### Step 7: Fix module path in go.mod if needed
```bash
# Only run this if go.mod shows wrong module
go mod edit -module=github.com/leger-labs/leger
go mod tidy
```

### Step 8: Test build
```bash
make clean
make build

# Should show version info (may show "development" without git tag)
./leger --version 2>&1 || echo "OK - leger placeholder"
./legerd --version 2>&1 || echo "OK - legerd placeholder"
```

### Step 9: Create test tag and rebuild
```bash
git tag v0.1.0-test
make build

# Now should show v0.1.0-test
./leger --version
./legerd --version
```

### Step 10: Test RPM creation
```bash
# Install nfpm if needed
go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest

# Build RPM
make rpm

# Verify RPM
ls -lh *.rpm
rpm -qilp leger-*.rpm | grep /var/lib/

# Should see /var/lib/leger/ NOT /var/lib/legerd/
```

### Step 11: Commit fixed files
```bash
git add nfpm.yaml Makefile scripts/ packaging/ .gitignore
git commit -m "fix: correct RPM packaging inconsistencies

- Fix directory paths: /var/lib/legerd -> /var/lib/leger
- Add missing scripts: generate-gpg-key.sh, publish-rpm.sh
- Fix module path in Makefile
- Add leger.repo for users
- Protect GPG private keys in .gitignore"

git push origin main
```

### Step 12: Test GitHub Actions (optional)
```bash
# Manual workflow test
# Go to: https://github.com/leger-labs/leger/actions
# Click: Release workflow -> Run workflow
# Enter: v0.1.0-test
# Click: Run workflow
# Monitor the build
```

---

## ⚡ One-Liner (if Claude outputs are available)

```bash
cd /path/to/leger && \
mkdir -p scripts packaging && \
cp /mnt/user-data/outputs/nfpm.yaml . && \
cp /mnt/user-data/outputs/Makefile . && \
cp /mnt/user-data/outputs/scripts/*.sh scripts/ && \
cp /mnt/user-data/outputs/packaging/leger.repo packaging/ && \
chmod +x scripts/*.sh && \
cat /mnt/user-data/outputs/.gitignore-additions >> .gitignore && \
echo "✅ Files copied! Run: make build"
```

---

## 📝 Critical Fixes Applied

1. ✅ **nfpm.yaml**: Fixed `/var/lib/legerd/` → `/var/lib/leger/`
2. ✅ **Makefile**: Fixed module path, added dual-binary support
3. ✅ **scripts/generate-gpg-key.sh**: Created (was missing)
4. ✅ **scripts/publish-rpm.sh**: Created (was missing)
5. ✅ **packaging/leger.repo**: Created (was missing)
6. ✅ **.gitignore**: Added GPG key protection

---

## 🎯 Verification Commands

After copying files, run these to verify everything is correct:

```bash
# Check directory paths in nfpm.yaml
grep "/var/lib/leger" nfpm.yaml | wc -l
# Should show 4 (not 0)

# Check module path in Makefile
grep "github.com/leger-labs/leger" Makefile
# Should show matches

# Check scripts exist and are executable
test -x scripts/generate-gpg-key.sh && echo "✅ GPG script OK" || echo "❌ Missing"
test -x scripts/publish-rpm.sh && echo "✅ Publish script OK" || echo "❌ Missing"

# Check .repo file exists
test -f packaging/leger.repo && echo "✅ Repo file OK" || echo "❌ Missing"

# Test build
make clean && make build && echo "✅ Build OK" || echo "❌ Build failed"
```

---

## 🚨 If Something Goes Wrong

### Build fails: "nfpm not found"
```bash
go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest
export PATH="$PATH:$(go env GOPATH)/bin"
```

### Module path errors
```bash
go mod edit -module=github.com/leger-labs/leger
go mod tidy
```

### Script permission denied
```bash
chmod +x scripts/*.sh
```

### RPM shows wrong directories
```bash
# Verify nfpm.yaml was updated correctly
grep "/var/lib/leger" nfpm.yaml
# If it shows /var/lib/legerd, copy the fixed file again
```

---

## ✅ Success Criteria

You'll know everything is fixed when:

```bash
✅ make build works
✅ ./leger --version shows version
✅ ./legerd --version shows version
✅ make rpm creates .rpm file
✅ rpm -qilp *.rpm shows /var/lib/leger (not legerd)
✅ scripts/ has both .sh files
✅ packaging/leger.repo exists
✅ git status doesn't show *.private.asc files
```

---

Ready to proceed with manual Cloudflare setup from the original guide! 🎉
