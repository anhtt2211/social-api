import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RepositoryModule } from "./repositories/repository.module";

@Module({
  imports: [TypeOrmModule.forRoot(), RepositoryModule],
})
export class PersistenceModule {}
