import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTableBlock1671177119327 implements MigrationInterface {
    name = 'updateTableBlock1671177119327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" ADD "type" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataAlignment" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataText" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataCaption" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataFileUrl" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataFileInfoWidth" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataFileInfoHeight" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataFileInfoHeight" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataFileInfoWidth" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataFileUrl" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataCaption" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataText" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" ALTER COLUMN "dataAlignment" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "block" DROP COLUMN "type"`, undefined);
    }

}
