# Share Codecommit Role

This repository contains a CDK stack that creates a CodeCommit repository and a role that can be assumed by another account to access the repository.

# Prerequisites

- awscli
- node.js 18+
- AWS Account and locally configured AWS credential

# Installation

## Deploy infrastructure

1. open [**/infra/config/dev.toml**](infra/config/dev.toml) and replace following values for your environment

> repository will be created with following name

```toml
[repository]
name="share-test" # replace with your repository name

[share]
account="111122223333" # replace with your account id
```

2. copy `dev.toml` file under infra folder with name `.toml`

```bash
$ cd infra
$ cp config/dev.toml .toml
```

3. deploy infrastructure

install cdk

```bash
$ npm i -g aws-cdk@2.126.0
```

deploy cdk

```bash
$ npm i
$ cdk bootstrap
$ cdk deploy "*" --require-apporval never
```

# Testing the role

Let's say, account `444455556666` has deployed this repository to share its codecommit repository with account `111122223333`.

created shareable role arn will be printed in the output of cdk deploy command.

check awscli on target account

```bash
$ aws sts get-caller-identity --query 'Account' --output text

111122223333
```

assume the role in target account using awscli

```bash
$ aws sts assume-role --role-arn arn:aws:iam::444455556666:role/ShareCodeCommitDevShareRepositoryRole --role-session-name share-codecommit
```

# Clone the repository

add following profile to your `~/.aws/config` file

> the default profile should have the permission to assume the role, like 111122223333 account above.

```toml
[profile codecommit]
region=ap-northeast-2
role_arn=arn:aws:iam::444455556666:role/ShareCodeCommitDevShareRepositoryRole
source_profile=default
```

install git-remote-codecommit

```bash
$ pip install git-remote-codecommit
```

clone the repository

```bash
$ git clone codecommit::ap-northeast-2://codecommit@share-test
```

# Cleanup

```bash
$ cdk destroy "*"
```
