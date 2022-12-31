import { Body, Controller, Get, Post, Put, UsePipes } from "@nestjs/common";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./dto";
import { User } from "./user.decorator";
import { UserRO } from "./user.interface";
import { UserService } from "./user.service";

@ApiBearerAuth()
@ApiTags("user")
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "get current user" })
  @Get("user")
  async findMe(@User("email") email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }

  @ApiOperation({ summary: "update user" })
  @ApiBody({ type: UpdateUserDto, required: true })
  @Put("user")
  async update(
    @User("id") userId: number,
    @Body("user") userData: UpdateUserDto
  ): Promise<UserRO> {
    return await this.userService.update(userId, userData);
  }

  @ApiOperation({ summary: "create user" })
  @ApiBody({ type: CreateUserDto, required: true })
  @UsePipes(new ValidationPipe())
  @Post("users")
  async create(@Body("user") userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @ApiOperation({ summary: "login" })
  @ApiBody({ type: LoginUserDto, required: true })
  @UsePipes(new ValidationPipe())
  @Post("users/login")
  async login(@Body("user") loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = { User: " not found" };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(_user);
    const { email, username, bio, image } = _user;
    const user = { email, token, username, bio, image };
    return { user };
  }
}
