# Changelog

All notable changes to Leger will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/leger-labs/leger/compare/v0.2.0...v0.3.0) (2025-11-12)


### Features

* **auth:** auto-open web app in browser after CLI login ([#64](https://github.com/leger-labs/leger/issues/64)) ([3d37acc](https://github.com/leger-labs/leger/commit/3d37accdfae55ce86aad9a86987675e0feb6172f))
* **docs:** implement automatic documentation generation and shell completions ([#62](https://github.com/leger-labs/leger/issues/62)) ([7ff2d91](https://github.com/leger-labs/leger/commit/7ff2d91d3e369598e9d3aad887b2bc161d7642f0))
* **secrets:** implement leger secrets sync command ([#63](https://github.com/leger-labs/leger/issues/63)) ([2e75891](https://github.com/leger-labs/leger/commit/2e75891ed0f4f9b26f68f6fd2de260608a19d359))


### Bug Fixes

* **ci:** configure GPG for non-interactive RPM signing ([#57](https://github.com/leger-labs/leger/issues/57)) ([51deff3](https://github.com/leger-labs/leger/commit/51deff3baec1ef328c4eed4b8b901563dbc5e650))
* **ci:** enable GPG signing and publishing for workflow_dispatch releases ([#54](https://github.com/leger-labs/leger/issues/54)) ([fd6d398](https://github.com/leger-labs/leger/commit/fd6d398b5c27218b74cacd0024c21725ed2e54d4))
* **ci:** resolve nfpm environment variable substitution in release workflow ([#53](https://github.com/leger-labs/leger/issues/53)) ([8d69ba3](https://github.com/leger-labs/leger/commit/8d69ba39de8fabb699199df9437c92d7925d0d32))
* **ci:** resolve YAML syntax error in release workflow ([#50](https://github.com/leger-labs/leger/issues/50)) ([0ab8f89](https://github.com/leger-labs/leger/commit/0ab8f89db0fb34cea0f75a249b035f82d4026d22))
* **ci:** use full GPG fingerprint for ownertrust import ([#56](https://github.com/leger-labs/leger/issues/56)) ([825b1f3](https://github.com/leger-labs/leger/commit/825b1f3728e2304a8dee95b8635933d63fa98454))
* improve legerd dependency on tailscale network ([fe55c92](https://github.com/leger-labs/leger/commit/fe55c92f0cf33dc90672ec6007fee6c7e13048c0))
* **rpm:** fix arithmetic expansion causing script exit ([#60](https://github.com/leger-labs/leger/issues/60)) ([6d82d40](https://github.com/leger-labs/leger/commit/6d82d403ec788e3ab432a217a79cde991ceb4a24))
* **rpm:** reorganize repository with architecture-specific directories ([#59](https://github.com/leger-labs/leger/issues/59)) ([0ede903](https://github.com/leger-labs/leger/commit/0ede903d7b518c982801a8ede13e620c2fd8f2b1))
* **tailscale:** handle empty TailscaleIPs slice to prevent panic ([#61](https://github.com/leger-labs/leger/issues/61)) ([93eb9d8](https://github.com/leger-labs/leger/commit/93eb9d8128b949c96f5945b12013eaf5bd0f25a8))


### Documentation

* auto-update CLI documentation [skip ci] ([9bc2f6a](https://github.com/leger-labs/leger/commit/9bc2f6a1d2b05042a326f2242a9d630062caa14b))
* auto-update CLI documentation [skip ci] ([e7e3719](https://github.com/leger-labs/leger/commit/e7e37198ddd0e43ac145d3369a12a68517925254))

## [0.2.0](https://github.com/leger-labs/leger/compare/v0.1.0...v0.2.0) (2025-10-22)


### Features

* **auth:** implement never-expiring tokens for v1.0 ([#40](https://github.com/leger-labs/leger/issues/40)) ([4d815bb](https://github.com/leger-labs/leger/commit/4d815bbf66c1c8724fdedbf8d532743121cdaf27))
* **backup:** implement Issue [#17](https://github.com/leger-labs/leger/issues/17) - Backup & Restore System ([#30](https://github.com/leger-labs/leger/issues/30)) ([4d8a3ae](https://github.com/leger-labs/leger/commit/4d8a3aee4470cd96c5aea939952fb530e7fd75a9))
* **cli:** implement auth commands with local storage ([#20](https://github.com/leger-labs/leger/issues/20)) ([c0c639d](https://github.com/leger-labs/leger/commit/c0c639de244669b903091c09ce5eafefbbae7487)), closes [#13](https://github.com/leger-labs/leger/issues/13)
* **cli:** implement Cobra CLI structure ([#17](https://github.com/leger-labs/leger/issues/17)) ([05d93f8](https://github.com/leger-labs/leger/commit/05d93f8d77cfaff5657878d4bd795e2ccfd704a9)), closes [#10](https://github.com/leger-labs/leger/issues/10)
* **cli:** implement legerd HTTP client ([#21](https://github.com/leger-labs/leger/issues/21)) ([23078bf](https://github.com/leger-labs/leger/commit/23078bfdaa86bd072605f1cfa60c7972f7d1a0a7)), closes [#12](https://github.com/leger-labs/leger/issues/12)
* **cli:** implement Tailscale identity verification ([#19](https://github.com/leger-labs/leger/issues/19)) ([b09a756](https://github.com/leger-labs/leger/commit/b09a75687f47ea062516aa7ba0edc36d47ed0071)), closes [#11](https://github.com/leger-labs/leger/issues/11)
* **config:** implement Issue [#15](https://github.com/leger-labs/leger/issues/15) - Configuration & Multi-Source Support ([#26](https://github.com/leger-labs/leger/issues/26)) ([88f9208](https://github.com/leger-labs/leger/commit/88f920886380f11afda910df4117501d3feeddf0))
* **core:** implement issue [#14](https://github.com/leger-labs/leger/issues/14) - core deployment infrastructure ([#24](https://github.com/leger-labs/leger/issues/24)) ([38a3152](https://github.com/leger-labs/leger/commit/38a31529c4e91ffb0e88ab34d5b5cb483502dc24))
* **packaging:** add complete RPM distribution infrastructure ([#46](https://github.com/leger-labs/leger/issues/46)) ([2e2fa05](https://github.com/leger-labs/leger/commit/2e2fa0544bdb2420aa73703d8f3e10a97bae9a44))
* **secrets,validation:** implement Issue [#18](https://github.com/leger-labs/leger/issues/18) - Secrets & Validation ([#32](https://github.com/leger-labs/leger/issues/32)) ([cdbbfa9](https://github.com/leger-labs/leger/commit/cdbbfa94aba1969ae02861f9fa397c0e9e7d62ee))
* **staging:** implement Issue [#16](https://github.com/leger-labs/leger/issues/16) - Staged Updates Workflow ([#28](https://github.com/leger-labs/leger/issues/28)) ([4b4e50b](https://github.com/leger-labs/leger/commit/4b4e50ba01f0883bbf9e686ec09580f23207b941))
* **ui,tests,docs:** implement Issue [#19](https://github.com/leger-labs/leger/issues/19) - Polish & Integration Testing ([#34](https://github.com/leger-labs/leger/issues/34)) ([badcfe7](https://github.com/leger-labs/leger/commit/badcfe7226040eee22a5923641408cbb5b5932d5))


### Bug Fixes

* **cli:** properly track deployments and improve test reliability ([#44](https://github.com/leger-labs/leger/issues/44)) ([b7367df](https://github.com/leger-labs/leger/commit/b7367dfbf03d580070c3af8c1dd137a38e8688cc))
* **lint:** resolve staticcheck error string formatting issues ([#45](https://github.com/leger-labs/leger/issues/45)) ([b662d56](https://github.com/leger-labs/leger/commit/b662d567577822b9d2d9eb16d381ad65ee0bd40f))
* **podman:** replace non-existent podman quadlet commands with file operations ([#43](https://github.com/leger-labs/leger/issues/43)) ([1bcbf0f](https://github.com/leger-labs/leger/commit/1bcbf0f05d1c694c87248e34a18b6750240e3726))
* resolve go formatting issues and podman quadlet command compatibility ([#42](https://github.com/leger-labs/leger/issues/42)) ([04c5208](https://github.com/leger-labs/leger/commit/04c520840d63b1b67547e86f2f168d19be7be7c3))
* **tests:** resolve all linting issues and fix integration test binary path ([#38](https://github.com/leger-labs/leger/issues/38)) ([d3cb2ef](https://github.com/leger-labs/leger/commit/d3cb2efbda74cf2d4bec3e9dfbec45bb9fbe1d99))


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
