# auto-release

![License](https://img.shields.io/badge/License-MIT-blue.svg)
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

## Usage

1. Installing CLI
```shell
npm install -g @nutint/auto-release
```
2. Set up configuration file at your project's root directory `your-project-root-dir/auto-release.config.json`
```json
{
  "jiraConfiguration": {
    "host": "https://yourdomain.jira.com",
    "authentication": {
      "email": "your@email.com",
      "apiToken": "your-jira-api-token"
    }
  }
}
```
3. Try create jira release version and tag issues with the version
```shell
# your-project-root-dir
npx auto-release \
    create-jira-release \
    --jira-project-key=PROJ \
    --jira-version-name=1.0.1 \
    --jira-issues=PROJ-1,PROJ-2,PROJ-3
```
