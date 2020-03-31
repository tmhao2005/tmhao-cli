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

```sh
tmhao-cli hotfix <yourApp> <yourHotfixBranchName> [-b, --branchCreation]

Example:

tmhao-cli hotfix go1-player link-issue -b
```

### Job

```sh
tmhao-cli job <yourApp> <yourBranch> <yourJobName> [-p, --play]

Example:

tmhao-cli job go1-player master deploy:qa:k8s -p
```

### Generate a local link for the player

```sh
tmhao-cli player-local-link <yourProdLink> <yourContentPath>

Example: 

tmhao-cli player-local-link https://tmhao.mygo1.com/p/#/token?token=a0bbcb26-23fe-4248-8017-14d6db891df7 /540221/

-> http://localhost:3000/540221?token=a0bbcb26-23fe-4248-8017-14d6db891df7&portal=tmhao.mygo1.com

```
