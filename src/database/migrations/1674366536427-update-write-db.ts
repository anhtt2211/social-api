import { MigrationInterface, QueryRunner } from "typeorm";

export class updateWriteDb1674366536427 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TRIGGER tsvectorupdate ON article;");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
