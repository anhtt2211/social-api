import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateArticleOutbox1711508199814 implements MigrationInterface {
  name = "CreateArticleOutbox1711508199814";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "article_block_outbox_entity" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "aggregatetype" character varying(255) NOT NULL,
            "aggregateid" character varying(255) NOT NULL,
            "type" character varying(255) NOT NULL,
            "payload" jsonb NOT NULL,
            CONSTRAINT "PK_38eabdbbdeabd20c1f85e27643c" PRIMARY KEY ("id")
        )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "article_block_outbox_entity"`);
  }
}
