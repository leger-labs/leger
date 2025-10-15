# Changelog

All notable changes to Leger will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 (2025-10-15)


### Documentation

* add a section about the FileClient ([#103](https://github.com/leger-labs/leger/issues/103)) ([2400b8d](https://github.com/leger-labs/leger/commit/2400b8d07c1b9670507520dea65a1cd5864ee04a))
* add a warning about caching and updates ([#117](https://github.com/leger-labs/leger/issues/117)) ([79772de](https://github.com/leger-labs/leger/commit/79772de91d0a78d4e02ac81f5ad374e699345d14))
* add an API Overview section ([9bc1a5a](https://github.com/leger-labs/leger/commit/9bc1a5ae8825b539b83fdea844b9eb23507937f4))
* add godoc and CI links to the README.md ([#135](https://github.com/leger-labs/leger/issues/135)) ([f66888a](https://github.com/leger-labs/leger/commit/f66888ab66d4a74836b3af539d1d536f56a67795))
* add server.md ([#110](https://github.com/leger-labs/leger/issues/110)) ([7825a24](https://github.com/leger-labs/leger/commit/7825a243a73168321cf835001bb61b1745c5bdc2))
* add usage and migration documentation ([#74](https://github.com/leger-labs/leger/issues/74)) ([56d38f5](https://github.com/leger-labs/leger/commit/56d38f51012daf0b9dc4e10bf227eba5cf36cbea))
* fix typos in the README.md file ([#77](https://github.com/leger-labs/leger/issues/77)) ([07dde05](https://github.com/leger-labs/leger/commit/07dde05889e7a1e0b2b08078cb08c7f16f0e7e19))
* Improve setec documentation UX ([#130](https://github.com/leger-labs/leger/issues/130)) ([445cadb](https://github.com/leger-labs/leger/commit/445cadbbca3d231abccaa3664d66dcf10a3c2e06))
* update API documentation with recent changes ([#85](https://github.com/leger-labs/leger/issues/85)) ([dcf4373](https://github.com/leger-labs/leger/commit/dcf4373813de5b671a3b24fd1fc2bdabe49611fc))
* update API valid date ([0f9da31](https://github.com/leger-labs/leger/commit/0f9da31c9cabf0fd73fc55725b4c8bccde60ce56))
* update to remove references to the now-unexported watcher ([#125](https://github.com/leger-labs/leger/issues/125)) ([e6eb936](https://github.com/leger-labs/leger/commit/e6eb93658ed3bfb984a6522b34990023acc33af5))

## [Unreleased]

### Added
- Initial fork of tailscale/setec as legerd daemon
- Leger CLI skeleton structure
- Project infrastructure (Makefile, CI, systemd units)
- Documentation for development and upstream syncing

### Changed
- Renamed setec binary to legerd
- Updated default paths (setec-dev → legerd-dev)
- Reorganized repository for monorepo structure

## [0.1.0] - TBD

Initial release - coming soon
