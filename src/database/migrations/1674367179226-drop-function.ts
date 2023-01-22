import { MigrationInterface, QueryRunner } from "typeorm";

export class dropFunction1674367179226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP FUNCTION article_tsvector_trigger();");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
