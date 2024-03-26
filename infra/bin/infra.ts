#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ShareRepositoryStack } from '../lib/stacks/share-repository-stack';
import { Config } from '../config/loader';

const app = new cdk.App({
  context: {
    ns: Config.app.ns,
    stage: Config.app.stage,
  },
});

new ShareRepositoryStack(app, `ShareRepositoryStack`, {
  shareAccountId: Config.share.account,
  expiryDate: Config.share.expiryDate,
  repositoryName: Config.repository.name,
  env: {
    region: Config.aws.region,
  },
});
