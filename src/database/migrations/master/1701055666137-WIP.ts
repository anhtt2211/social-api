import { MigrationInterface, QueryRunner } from "typeorm";

export class WIP1701055666137 implements MigrationInterface {
  name = "WIP1701055666137";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" ADD "authorId" integer`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "FK_df950727221b7c53576e03800d8" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "FK_df950727221b7c53576e03800d8"`
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "authorId"`);
  }
}
