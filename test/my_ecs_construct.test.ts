import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import MyEcsConstruct = require('../lib/my_ecs_construct-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MyEcsConstruct.MyEcsConstructStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});