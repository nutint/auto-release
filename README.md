# auto-release

![License](https://img.shields.io/github/license/nutint/auto-release)
![GitHub last commit](https://img.shields.io/github/last-commit/nutint/auto-release)
![GitHub issues](https://img.shields.io/github/issues/nutint/auto-release)
![Coverage](https://codecov.io/gh/nutint/auto-release/branch/main/graph/badge.svg)


auto-release is a tool designed to simplify and automate the release process across different programming languages. It provides automated versioning, release notes generation, Git tagging, and Jira integration, making it easier to manage releases in projects of all sizes.

## Features

- **Automated Release Notes**: Generates release notes by scanning the Git commit history.
- **Version Management**: Automatically calculates the new version based on the conventional commits (breaking changes, features, fixes).
- **Git Tagging**: Automatically tags the latest Git revision with the calculated version.
- **Jira Integration**: Tags Jira issues with the release version and automatically creates Jira release versions.
- **Cross-Language Support**: Works with various project types (e.g., Node.js, Scala, C#, etc.).

## Installation

### 1. Using the CLI

You can install the auto-release as a global CLI tool using `npm`:

```bash
npm install -g @nutint/auto-release
```
