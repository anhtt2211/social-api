import {MigrationInterface, QueryRunner} from "typeorm";

export class wip1672463269770 implements MigrationInterface {
    name = 'wip1672463269770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."block_type_enum" RENAME TO "block_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."block_type_enum" AS ENUM('paragraph', 'image', 'smallerHeader', 'biggerHeader', 'text', 'quote', 'delimiter', 'pullquote', 'linkTool', 'unsplash')`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" TYPE "public"."block_type_enum" USING "type"::"text"::"public"."block_type_enum"`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" SET DEFAULT 'paragraph'`);
        await queryRunner.query(`DROP TYPE "public"."block_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."block_type_enum_old" AS ENUM('paragraph', 'image', 'smallerHeader', 'biggerHeader', 'text', 'quote', 'delimiter', 'pullquote', 'linkTool')`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" TYPE "public"."block_type_enum_old" USING "type"::"text"::"public"."block_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "type" SET DEFAULT 'paragraph'`);
        await queryRunner.query(`DROP TYPE "public"."block_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."block_type_enum_old" RENAME TO "block_type_enum"`);
    }

}
