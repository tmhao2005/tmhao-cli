## Input your private key
Create `.env` at the top level containing following values:

```sh
GITLAB_TOKEN=<YOUR_PRIVATE_KEY>
GITLAB_API=<YOUR_GITLAB_ENDPOINT>
```

## Install

```sh
yarn build
yarn link 
```

If you run into the problem of `permission deined`, just set read permission:
```
sudo chmod 755 /usr/local/bin/tmhao-cli
```

## CLI
### Hotfix

```
tmhao-cli hotfix <yourApp> <yourHotfixBranchName>
tmhao-cli playJob <yourApp> <yourBranch> [checkOnly]
```
