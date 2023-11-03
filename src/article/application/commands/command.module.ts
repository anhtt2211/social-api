import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WRITE_CONNECTION } from "../../../configs";
import { InfrastructureModule } from "../../../database/infrastructure/infrastructure.module";
import { FollowsEntity } from "../../../profile/core/entities";
import { RabbitMqModule } from "../../../rabbitmq/rabbitmq.module";
import { UserEntity } from "../../../user/core";
import { UserModule } from "../../../user/user.module";
import { ArticleEntity, BlockEntity, CommentEntity } from "../../core/entities";
import { ArticleService } from "../services";
import { CommandHandlers } from "./index";

@Module({
  imports: [
    {
      forwardRef: () =>
        TypeOrmModule.forFeature(
          [
            ArticleEntity,
            UserEntity,
            CommentEntity,
            FollowsEntity,
            BlockEntity,
          ],
          WRITE_CONNECTION
        ),
    },
    { forwardRef: () => InfrastructureModule },
    UserModule,
    CqrsModule,
    RabbitMqModule,
  ],
  providers: [ArticleService, ...CommandHandlers],
  controllers: [],
})
export class CommandModule {}
