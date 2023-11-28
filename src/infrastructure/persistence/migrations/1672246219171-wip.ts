import {MigrationInterface, QueryRunner} from "typeorm";

export class wip1672246219171 implements MigrationInterface {
    name = 'wip1672246219171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_3b80ae56288924ab30cc9e70435"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_9ea0140751b603ea826c19e1a33"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "created" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "updated" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."block_type_enum" RENAME TO "block_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."block_type_enum" AS ENUM('paragraph', 'image', 'smallerHeader', 'text', 'qoute')`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" TYPE "public"."block_type_enum" USING "type"::"text"::"public"."block_type_enum"`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" SET DEFAULT 'paragraph'`);
        await queryRunner.query(`DROP TYPE "public"."block_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_3b80ae56288924ab30cc9e70435" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_9ea0140751b603ea826c19e1a33" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_9ea0140751b603ea826c19e1a33"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_3b80ae56288924ab30cc9e70435"`);
        await queryRunner.query(`CREATE TYPE "public"."block_type_enum_old" AS ENUM('paragraph', 'image', 'smallerHeader', 'text')`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" TYPE "public"."block_type_enum_old" USING "type"::"text"::"public"."block_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" SET DEFAULT 'paragraph'`);
        await queryRunner.query(`DROP TYPE "public"."block_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."block_type_enum_old" RENAME TO "block_type_enum"`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "updated" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "article" ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_9ea0140751b603ea826c19e1a33" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_3b80ae56288924ab30cc9e70435" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
