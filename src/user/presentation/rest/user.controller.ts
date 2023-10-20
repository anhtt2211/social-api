import { Body, Controller, Get, Post, Put, UsePipes } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

import { User } from "../../../shared/middleware/user.decorator";
import { ValidationPipe } from "../../../shared/pipes/validation.pipe";
import {
  CreateUserCommand,
  UpdateUserCommand,
} from "../../application/commands";
import { FindUserById, LoginQuery } from "../../application/queries";
import { CreateUserDto, LoginUserDto, UpdateUserDto } from "../../core/dto";
import { UserRO } from "../../core/interfaces/user.interface";

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
  async findMe(@User("id") id: number): Promise<UserRO> {
    return this.queryBus.execute(new FindUserById(id));
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
