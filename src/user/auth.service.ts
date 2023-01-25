import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";

@Injectable()
export class CognitoService {
  private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

  constructor() {
    AWS.config.update({
      accessKeyId: "YOUR_ACCESS_KEY",
      secretAccessKey: "YOUR_SECRET_KEY",
      region: "YOUR_REGION",
    });
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider();
  }

  async signUp(
    username: string,
    password: string,
    email: string
  ): Promise<AWS.CognitoIdentityServiceProvider.SignUpResponse> {
    const params = {
      ClientId: "YOUR_CLIENT_ID",
      Password: password,
      Username: username,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };

    return this.cognitoIdentity.signUp(params).promise();
  }

  async confirmSignUp(
    username: string,
    confirmationCode: string
  ): Promise<AWS.CognitoIdentityServiceProvider.ConfirmSignUpResponse> {
    const params = {
      ClientId: "YOUR_CLIENT_ID",
      ConfirmationCode: confirmationCode,
      Username: username,
    };

    return this.cognitoIdentity.confirmSignUp(params).promise();
  }

  async signIn(
    username: string,
    password: string
  ): Promise<AWS.CognitoIdentityServiceProvider.InitiateAuthResponse> {
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "YOUR_CLIENT_ID",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    return this.cognitoIdentity.initiateAuth(params).promise();
  }

  async signOut(
    username: string
  ): Promise<AWS.CognitoIdentityServiceProvider.AdminUserGlobalSignOutResponse> {
    const params = {
      UserPoolId: "YOUR_USER_POOL_ID",
      Username: username,
    };

    return this.cognitoIdentity.adminUserGlobalSignOut(params).promise();
  }

  async getUser(
    accessToken: string
  ): Promise<AWS.CognitoIdentityServiceProvider.GetUserResponse> {
    const params = {
      AccessToken: accessToken,
    };

    return this.cognitoIdentity.getUser(params).promise();
  }
}
