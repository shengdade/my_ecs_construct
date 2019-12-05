#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { MyEcsConstructStack } from '../lib/my_ecs_construct-stack';

const app = new cdk.App();
new MyEcsConstructStack(app, 'MyEcsConstructStack');
