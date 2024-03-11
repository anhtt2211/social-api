import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleTable1706607288006 implements MigrationInterface {
  name = "UpdateArticleTable1706607288006";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" ADD "readingTime" integer NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD "commentCount" integer NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "commentCount"`);
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "readingTime"`);
  }
}
