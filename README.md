# php-composer-version [![npm version](https://badge.fury.io/js/%40pxlwidgets%2Fphp-composer-version.svg)](https://badge.fury.io/js/%40pxlwidgets%2Fphp-composer-version)

This is a small CLI tool that bumps versions of php-composer packages,
similar to how `npm version` works. On input of a new version number:

1. If enabled through CLI option (`-p`), the new version is written to the project's `package.json`.
2. The new version is written to the project's `composer.json`.
3. Above changes are committed with a provided message if given (`-m`), or otherwise the version number as message.
4. The created commit is tagged with the version number.

[View changelog.][changelog]

## installation

Install the package from npm, either globally for your system, or locally in the project.
It depends on your needs which approach to take.

```bash
$ npm install --save-dev @pxlwidgets/php-composer-version
```

If you choose to install globally the script should be available under the name
`php-composer-version`. Otherwise add an npm script that has access to the local
version to `package.json`:

```json
{
  "scripts": {
    "bump-version": "php-composer-version"
  }
}
```

## Usage

Run the script from the command line from your project root.

```bash
# for global installations
$ php-composer-version
# for local installations
$ npm run bump-version
```

The script will then prompt you for the new version to write to the repository,
and then perform the steps mentioned above:

> ```
> Enter new version number (current: 0.2.3)
>     version >
> ```

Alternatively the new version can be given as CLI argument with `-V` (capital v) or `--set-version`:

```bash
$ php-composer-version --set-version 0.2.4
# OR
$ php-composer-version -V 0.2.4
```

This approach allows for automated versioning where interactive sessions won't work.

## Checks

- **Version comparison**

  The entered version is compared against the current version to make sure that
  the new version is greater than the current.

- **Version availability check**

  The entered version is compared against all git tags to make sure that no
  tag already exists by the name of the version.

- **Git branch check**

  By default the branch name to commit on is fixed to `master`. Most of the times
  a new release should be a master revision. Exceptions might be revisions of
  pre-release stages as `alpha`, `beta` or `rc`. To override the target branch
  use the `--branch` option.

- **Git status check**

  If the working directory is not clean, the user is asked permission to continue.
  To skip the prompt and always allow additional changes,
  use the `--allow-dirty` option flag.

### Self information

#### `-h, --help`

Displays available options and short documentation, and then exits the process.

#### `-v, --version`

Displays the current version of `php-composer-version` and then exits the process.

### Versioning CLI Options:

#### `-V, --set-version <new-version>`

Specify the new package version to write. If not provided, `php-composer-version`
will prompt interactively. This argument is required for non-interactive sessions.

#### `-b, --branch <name>`

Set the target branch for the version commit. If on any other branch, the process will fail.

#### `-m, --message <message>`

Specify a custom message for the version commit. Sequences of `%s` within given `<message>` is replaced with
the version number. If not provided, the new version number is used as the commit message.

#### `-d, --allow-dirty`

Allow additional changes to be committed with the version commit. If not given, and the
Git stage contains changes, the user is asked interactively if the process should continue.
If this flag is given or the user confirms to continue, any currently staged changes will be
part of the version commit.

This is primarily useful to include other version-related information, such as changelog updates,
or generated documentation.

#### `-p, --sync-package-json`

Toggle additional update of the version number in package.json.

## License

The MIT License (MIT)

Copyright (c) 2019 PXL.Widgets B.V.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[changelog]: https://github.com/PXLWidgets/php-composer-version/blob/master/CHANGELOG.md
[readme]: https://github.com/PXLWidgets/php-composer-version/blob/master/README.md
