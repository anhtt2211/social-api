import {MigrationInterface, QueryRunner} from "typeorm";

export class wip1672475335274 implements MigrationInterface {
    name = 'wip1672475335274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "body"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "body" character varying NOT NULL DEFAULT ''`);
    }

}
