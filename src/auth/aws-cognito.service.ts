import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { AuthRegisterUserDto } from './dto/auth-register-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor(private prisma: PrismaService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });
  }

  async registerUser(registerUserDto: AuthRegisterUserDto) {
    const { name, email, password } = registerUserDto;
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: name,
          }),
        ],
        null,
        async (err, result) => {
          if (!result) {
            reject(err);
          } else {
            await this.prisma.user.create({
              data: {
                email,
                name,
              },
            });
            resolve(result.user);
          }
        },
      );
    });
  }

  async authenticateUser(loginUserDto: AuthLoginUserDto) {
    const { email, password } = loginUserDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }
}
