import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as iam from 'aws-cdk-lib/aws-iam';

interface IProps extends cdk.StackProps {
  shareAccountId: string;
  expiryDate: string;
  repositoryName: string;
}

export class ShareRepositoryStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const repository = this.newCodeCommitRepository(props);
    this.newSharingRole(props, repository);
  }

  private newCodeCommitRepository(props: IProps): codecommit.Repository {
    return new codecommit.Repository(this, 'Repository', {
      repositoryName: props.repositoryName,
    });
  }

  private newSharingRole(
    props: IProps,
    repository: codecommit.Repository
  ): iam.Role {
    const ns = this.node.tryGetContext('ns') as string;
    const role = new iam.Role(this, 'SharingRole', {
      roleName: `${ns}ShareRepositoryRole`,
      assumedBy: new iam.AccountPrincipal(props.shareAccountId),
      inlinePolicies: {
        shareRepository: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['codecommit:GitPull', 'codecommit:GitPush'],
              resources: [repository.repositoryArn],
              conditions: {
                DateLessThan: {
                  'aws:CurrentTime': props.expiryDate,
                },
              },
            }),
          ],
        }),
      },
    });

    new cdk.CfnOutput(this, 'RoleArn', {
      value: role.roleArn,
    });
    return role;
  }
}
