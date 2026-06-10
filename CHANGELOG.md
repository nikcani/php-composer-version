# Changelog

[![npm version](https://badge.fury.io/js/%40pxlwidgets%2Fphp-composer-version.svg)](https://badge.fury.io/js/%40pxlwidgets%2Fphp-composer-version)

All notable changes to [`@pxlwidgets/php-composer-version`][repo] will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0] (2019-07-26)

### Added

- CLI option `-m, --message` to override the commit message content for a version commit.
  Sequences of `%s` within a given message are replaced with the new version number.

## [1.2.2] (2019-07-19)

### Fixed

- Now only adds touched files to Git stage before version commit, whereas before
  the entire working copy was committed when the option **allow dirty** was toggled,
  and there were unstaged changes.

## [1.2.1] (2019-07-19)

### Fixed

- Missing CLI option documentation for `--set-version`

## [1.2.0] (2019-07-19)

### Added

- Branch existence check for branch names provided with `--branch`
- CLI option `-V, --set-version <version>` for providing a version as CLI argument.

### Fixed

- Runtime error when the `composer.json` file has no version key.

## [1.1.2] (2019-06-22)

### Added

- CLI option for specifying the target branch of the version commit.
- Additional documentation.

## [1.1.1] (2019-06-21)

### Added

- CLI arguments documentation to README.

## [1.1.0] (2019-06-20)

### Added

- This Changelog file
- CLI option for displaying CLI help page.
- CLI option for displaying php-composer-version version number.
- CLI option to allow operating on a dirty working directory
  > When set, additional project changes may exist when running php-composer-version.
  > This allows for combining the version commit's changes with a CHANGELOG update, for instance.
- CLI option to toggle also updating the version in `package.json`
  > As of this release disabled by default - see 'Changed'
- Add CLI help page

### Changed

- Sync of version in package.json is now omitted by default > This allows users to do a global installation of this package, so that the PHP package
  under development does not have to have a `package.json` file in the repository.

## [1.0.0] (2019-06-19) (Initial release)

### Added

- Prompt for new version number
- Write action to `composer.json`
- Write action to `package.json`
- Git commit action, saving the changes to version control
- Git tag action, tagging the new commit with the version number
- Git tag availability check
- Version compare check (a new version must be greater than the current)

[repo]: https://github.com/PXLWidgets/php-composer-version
[Unreleased]: https://github.com/PXLWidgets/php-composer-version/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/PXLWidgets/php-composer-version/compare/v1.2.2...v1.3.0
[1.2.2]: https://github.com/PXLWidgets/php-composer-version/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/PXLWidgets/php-composer-version/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/PXLWidgets/php-composer-version/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/PXLWidgets/php-composer-version/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/PXLWidgets/php-composer-version/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/PXLWidgets/php-composer-version/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/PXLWidgets/php-composer-version/tree/v1.0.0
