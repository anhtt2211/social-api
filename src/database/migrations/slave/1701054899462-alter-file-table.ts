import {MigrationInterface, QueryRunner} from "typeorm";

export class alterFileTable1701054899462 implements MigrationInterface {
    name = 'alterFileTable1701054899462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."document_weights_idx"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "document_weights_idx" ON "article" ("document_with_weights") `);
    }

}
