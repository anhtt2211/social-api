import { MigrationInterface, QueryRunner } from "typeorm";

export class updateWriteDb1674751970460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."document_weights_idx"`);
    await queryRunner.query(`DROP INDEX "public"."article_slug"`);

    await queryRunner.query(`DROP INDEX "public"."user_email"`);
    await queryRunner.query(`DROP INDEX "public"."user_username"`);

    await queryRunner.query("DROP TRIGGER tsvectorupdate ON article;");
    await queryRunner.query("DROP FUNCTION article_tsvector_trigger();");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "article_slug" ON "article" ("slug") `
    );
    await queryRunner.query(
      `CREATE INDEX "document_weights_idx" ON "article" ("document_with_weights") `
    );

    await queryRunner.query(
      `CREATE INDEX "user_username" ON "user" ("username") `
    );
    await queryRunner.query(`CREATE INDEX "user_email" ON "user" ("email") `);
  }
}
