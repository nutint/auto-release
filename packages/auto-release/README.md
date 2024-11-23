# Auto Release

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
