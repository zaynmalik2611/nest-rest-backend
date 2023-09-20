import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterUserDto } from "./dto/register-user.dto";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException("Unauthenticated");
    }

    const userExists = await this.findUserByEmail(user.email);
    if (!userExists) {
      console.log("here");
      return this.registerUser({
        email: user.email,
        username: user.firstName + " " + user.lastName,
      });
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user: RegisterUserDto) {
    try {
      console.log("entered this zone");
      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          username: user.username,
        },
      });
      console.log("created", newUser);
      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  }
}
