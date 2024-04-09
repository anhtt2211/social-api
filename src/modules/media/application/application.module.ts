import { Module } from "@nestjs/common";

import { DropboxService, S3Service } from "./services";

@Module({
  providers: [S3Service, DropboxService],
  exports: [S3Service, DropboxService],
})
export class ApplicationModule {}
