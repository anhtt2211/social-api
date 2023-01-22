import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTableUserWriteDb1674366430350 implements MigrationInterface {
  name = "updateTableUserWriteDb1674366430350";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."user_email"`);
    await queryRunner.query(`DROP INDEX "public"."user_username"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "user_username" ON "user" ("username") `
    );
    await queryRunner.query(`CREATE INDEX "user_email" ON "user" ("email") `);
  }
}
