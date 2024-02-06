import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as iam from 'aws-cdk-lib/aws-iam';

interface IProps extends cdk.StackProps {
  shareAccountId: string;
  repositoryName: string;
}

export class ShareRepositoryStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const repository = this.newCodeCommitRepository(props);
    const role = this.newSharingRole(props);
    repository.grantPullPush(role);
  }

  private newCodeCommitRepository(props: IProps): codecommit.Repository {
    return new codecommit.Repository(this, 'Repository', {
      repositoryName: props.repositoryName,
    });
  }

  private newSharingRole(props: IProps): iam.Role {
    const ns = this.node.tryGetContext('ns') as string;
    const role = new iam.Role(this, 'SharingRole', {
      roleName: `${ns}ShareRepositoryRole`,
      assumedBy: new iam.AccountPrincipal(props.shareAccountId),
    });

    new cdk.CfnOutput(this, 'RoleArn', {
      value: role.roleArn,
    });
    return role;
  }
}
