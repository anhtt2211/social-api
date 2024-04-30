import {MigrationInterface, QueryRunner} from "typeorm";

export class wip1671276172761 implements MigrationInterface {
    name = 'wip1671276172761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`CREATE TYPE "block_type_enum" AS ENUM('paragraph', 'image', 'smallerHeader', 'text')`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "type" "block_type_enum" NOT NULL DEFAULT 'paragraph'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "type"`, undefined);
        await queryRunner.query(`DROP TYPE "block_type_enum"`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ADD "type" character varying NOT NULL`, undefined);
    }

}
