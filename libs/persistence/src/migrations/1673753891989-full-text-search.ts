import { MigrationInterface, QueryRunner } from "typeorm";

export class fullTextSearch1673753891989 implements MigrationInterface {
  name = "fullTextSearch1673753891989";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" ADD "document_with_weights" tsvector`
    );
    await queryRunner.query(`
      UPDATE article
      SET document_with_weights = setweight(to_tsvector(title), 'A') || setweight(to_tsvector(coalesce(description, '')), 'B');

      CREATE INDEX document_weights_idx ON article USING GIN (document_with_weights);

      CREATE FUNCTION article_tsvector_trigger() RETURNS TRIGGER AS $$
      begin
        new.document_with_weights :=
        setweight(to_tsvector(coalesce(new.title, '')), 'A')
        || setweight(to_tsvector(coalesce(new.description, '')), 'B');
        return new;
      end
      $$ LANGUAGE PLPGSQL;

      CREATE TRIGGER tsvectorupdate
      BEFORE
      INSERT
      OR
      UPDATE ON article
      FOR EACH ROW EXECUTE PROCEDURE article_tsvector_trigger();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" DROP COLUMN "document_with_weights"`
    );
  }
}
