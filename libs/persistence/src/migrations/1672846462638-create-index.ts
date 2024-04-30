import { MigrationInterface, QueryRunner } from "typeorm";

export class createIndex1672846462638 implements MigrationInterface {
  name = "createIndex1672846462638";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "user_username" ON "user" ("username") `
    );
    await queryRunner.query(`CREATE INDEX "user_email" ON "user" ("email") `);
    await queryRunner.query(
      `CREATE INDEX "article_slug" ON "article" ("slug") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."article_slug"`);
    await queryRunner.query(`DROP INDEX "public"."user_email"`);
    await queryRunner.query(`DROP INDEX "public"."user_username"`);
  }
}
