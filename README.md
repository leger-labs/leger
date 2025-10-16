# Leger - Podman Quadlet Manager with Secrets

[![CI](https://github.com/leger-labs/leger/actions/workflows/ci.yml/badge.svg)](https://github.com/leger-labs/leger/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

**Leger** is a modern CLI tool for managing Podman Quadlets from Git repositories with integrated secrets management. It combines the simplicity of declarative container definitions with secure secret handling powered by Tailscale.

## ✨ Features

- 🚀 **Git-based Deployments** - Install quadlets directly from GitHub or local directories
- 🔒 **Integrated Secrets** - Automatic secret injection via Tailscale-authenticated daemon
- 📦 **Native Podman** - Uses `podman quadlet` commands for 70% less code
- 🔄 **Staged Updates** - Preview changes before applying with automatic rollback
- 💾 **Backup & Restore** - Full deployment backups including volumes
- ✅ **Validation** - Pre-deployment checks for conflicts and syntax errors
- 🎨 **Beautiful CLI** - Color-coded output, progress bars, and formatted tables

## 🚀 Quick Start

### Installation

```bash
# From RPM (Fedora 42+)
sudo dnf install leger

# Start the secrets daemon
systemctl --user enable --now legerd.service
```

### First Deployment

```bash
# Authenticate
leger auth login

# Install from Git
leger deploy install myapp --source https://github.com/org/quadlets/tree/main/myapp

# Check status
leger status

# View logs
leger service logs myapp --follow
```

## 📚 Documentation

- **[User Guide](docs/user-guide.md)** - Get started with Leger
- **[Command Reference](docs/commands.md)** - Complete command documentation
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions
- **[Examples](examples/)** - Example deployments

## Components

- **`leger`** - CLI for managing Podman Quadlets
- **`legerd`** - Secrets management daemon (fork of [tailscale/setec](https://github.com/tailscale/setec))

## Status

🚧 **Active Development** - Progressing towards v1.0.0

### Completed Features
✅ Core deployment infrastructure
✅ Configuration & multi-source support
✅ Staged updates workflow
✅ Backup & restore system
✅ Secrets & validation
✅ Polish & integration testing

## Architecture

- **Authentication:** Tailscale identity
- **Networking:** Tailscale MagicDNS
- **Secrets:** legerd (setec fork)
- **Containers:** Podman Quadlets (systemd integration)

## Attribution

legerd is a fork of [setec](https://github.com/tailscale/setec) by Tailscale Inc.
See [NOTICE](NOTICE) and [LICENSE.setec](LICENSE.setec) for full attribution.

## License

- Leger components: Apache License 2.0
- legerd (setec fork): BSD-3-Clause (see LICENSE.setec)

## Development

```bash
# Build both binaries
make build

# Run tests
make test

# Build RPM
make rpm
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for details.
