import {MigrationInterface, QueryRunner} from "typeorm";

export class createDb1662609707249 implements MigrationInterface {
    name = 'createDb1662609707249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "articleId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "created" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "tagList" text NOT NULL, "favoriteCount" integer NOT NULL DEFAULT 0, "authorId" integer, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user_favorites_article" ("userId" integer NOT NULL, "articleId" integer NOT NULL, CONSTRAINT "PK_eb153a9f549f934488deb1c6025" PRIMARY KEY ("userId", "articleId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3b80ae56288924ab30cc9e7043" ON "user_favorites_article" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9ea0140751b603ea826c19e1a3" ON "user_favorites_article" ("articleId") `, undefined);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c20404221e5c125a581a0d90c0e" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_3b80ae56288924ab30cc9e70435" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" ADD CONSTRAINT "FK_9ea0140751b603ea826c19e1a33" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_9ea0140751b603ea826c19e1a33"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_favorites_article" DROP CONSTRAINT "FK_3b80ae56288924ab30cc9e70435"`, undefined);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c20404221e5c125a581a0d90c0e"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9ea0140751b603ea826c19e1a3"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_3b80ae56288924ab30cc9e7043"`, undefined);
        await queryRunner.query(`DROP TABLE "user_favorites_article"`, undefined);
        await queryRunner.query(`DROP TABLE "tag"`, undefined);
        await queryRunner.query(`DROP TABLE "follows"`, undefined);
        await queryRunner.query(`DROP TABLE "article"`, undefined);
        await queryRunner.query(`DROP TABLE "comment"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
