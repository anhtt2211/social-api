import { Body, Controller, Get, Post, Put, UsePipes } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "./dto";
import { CreateUserCommand, UpdateUserCommand } from "./commands";
import { FindUserByEmailQuery, LoginQuery } from "./queries";
import { User } from "./user.decorator";
import { UserRO } from "./user.interface";

@ApiBearerAuth()
@ApiTags("user")
@Controller()
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @ApiOperation({ summary: "get current user" })
  @Get("user")
  async findMe(@User("email") email: string): Promise<UserRO> {
    return this.queryBus.execute(new FindUserByEmailQuery(email));
  }

  @ApiOperation({ summary: "update user" })
  @ApiBody({ type: UpdateUserDto, required: true })
  @Put("user")
  async update(
    @User("id") userId: number,
    @Body("user") userData: UpdateUserDto
  ): Promise<UserRO> {
    return this.commandBus.execute(new UpdateUserCommand(userId, userData));
  }

  @ApiOperation({ summary: "create user" })
  @ApiBody({ type: CreateUserDto, required: true })
  @UsePipes(new ValidationPipe())
  @Post("users")
  async create(@Body("user") userData: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(userData));
  }

  @ApiOperation({ summary: "login" })
  @ApiBody({ type: LoginUserDto, required: true })
  @UsePipes(new ValidationPipe())
  @Post("users/login")
  async login(@Body("user") loginUserDto: LoginUserDto): Promise<UserRO> {
    return this.queryBus.execute(new LoginQuery(loginUserDto));
  }
}
