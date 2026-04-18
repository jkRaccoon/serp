#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SerpCertStack, SerpStack } from '../lib/serp-stack';

const app = new cdk.App();
const account = '778021795831';

const certStack = new SerpCertStack(app, 'SerpCert', {
  env: { account, region: 'us-east-1' },
  crossRegionReferences: true,
});

const siteStack = new SerpStack(app, 'Serp', {
  env: { account, region: 'ap-northeast-2' },
  crossRegionReferences: true,
  certificate: certStack.certificate,
});

siteStack.addDependency(certStack);
