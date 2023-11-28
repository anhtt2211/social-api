import { MigrationInterface, QueryRunner } from "typeorm";

export class createFileTable1701054117351 implements MigrationInterface {
  name = "createFileTable1701054117351";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "size" integer NOT NULL, "mimeType" character varying NOT NULL, "key" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
