import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableBlock1671173831369 implements MigrationInterface {
  name = "createTableBlock1671173831369";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block" ("id" SERIAL NOT NULL, "articleId" integer, "dataAlignment" character varying NOT NULL, "dataText" character varying NOT NULL, "dataCaption" character varying NOT NULL, "dataFileUrl" character varying NOT NULL, "dataFileInfoWidth" integer NOT NULL, "dataFileInfoHeight" integer NOT NULL, CONSTRAINT "PK_d0925763efb591c2e2ffb267572" PRIMARY KEY ("id"))`,
      undefined
    );
    await queryRunner.query(
      `ALTER TABLE "block" ADD CONSTRAINT "FK_cadb2e62d596d7bf0b8fc3f3b40" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "block" DROP CONSTRAINT "FK_cadb2e62d596d7bf0b8fc3f3b40"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "block"`, undefined);
  }
}
