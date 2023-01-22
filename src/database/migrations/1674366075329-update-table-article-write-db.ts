import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTableArticleWriteDb1674366075329
  implements MigrationInterface
{
  name = "updateTableArticleWriteDb1674366075329";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."document_weights_idx"`);
    await queryRunner.query(`DROP INDEX "public"."article_slug"`);
    await queryRunner.query(
      `ALTER TABLE "article" DROP COLUMN "document_with_weights"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" ADD "document_with_weights" tsvector`
    );
    await queryRunner.query(
      `CREATE INDEX "article_slug" ON "article" ("slug") `
    );
    await queryRunner.query(
      `CREATE INDEX "document_weights_idx" ON "article" ("document_with_weights") `
    );
  }
}
