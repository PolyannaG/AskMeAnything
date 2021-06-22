import {MigrationInterface, QueryRunner} from "typeorm";

export class DatabaseSOA1624191250314 implements MigrationInterface {
    name = 'DatabaseSOA1624191250314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "database"."keyword" ("keyword" character varying(40) NOT NULL, CONSTRAINT "PK_c775f1d3adb82dc42a88226356c" PRIMARY KEY ("keyword"))`);
        await queryRunner.query(`CREATE TABLE "database"."question" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying(10000) NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "popularity" integer NOT NULL DEFAULT 0, "userId" integer, CONSTRAINT "PK_ea24c3995b5ade5759a3e648ec6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "database"."user" ("id" SERIAL NOT NULL, "username" character varying(40) NOT NULL, "password" character varying NOT NULL, "email" character varying(40) NOT NULL, "user_since" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1dc708bb3770cc19703311eddcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "database"."answer" ("id" SERIAL NOT NULL, "text" character varying(10000) NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "questionId" integer, CONSTRAINT "PK_25aa60f35024a8aca6e32bb1756" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "database"."keyword_questions_question" ("keywordKeyword" character varying(40) NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_3754b91f4fdb245aff49251b295" PRIMARY KEY ("keywordKeyword", "questionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d0c6f8343e097a4a80713d55ab" ON "database"."keyword_questions_question" ("keywordKeyword") `);
        await queryRunner.query(`CREATE INDEX "IDX_621b0caa255d77a58c63670931" ON "database"."keyword_questions_question" ("questionId") `);
        await queryRunner.query(`ALTER TABLE "database"."question" ADD CONSTRAINT "FK_c427ed013f4186f078221a1cc58" FOREIGN KEY ("userId") REFERENCES "database"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "database"."answer" ADD CONSTRAINT "FK_149780a1831241afb691f1d4193" FOREIGN KEY ("userId") REFERENCES "database"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "database"."answer" ADD CONSTRAINT "FK_5d0988c5f3bdb227073985a0d84" FOREIGN KEY ("questionId") REFERENCES "database"."question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "database"."keyword_questions_question" ADD CONSTRAINT "FK_d0c6f8343e097a4a80713d55aba" FOREIGN KEY ("keywordKeyword") REFERENCES "database"."keyword"("keyword") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "database"."keyword_questions_question" ADD CONSTRAINT "FK_621b0caa255d77a58c636709315" FOREIGN KEY ("questionId") REFERENCES "database"."question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "database"."keyword_questions_question" DROP CONSTRAINT "FK_621b0caa255d77a58c636709315"`);
        await queryRunner.query(`ALTER TABLE "database"."keyword_questions_question" DROP CONSTRAINT "FK_d0c6f8343e097a4a80713d55aba"`);
        await queryRunner.query(`ALTER TABLE "database"."answer" DROP CONSTRAINT "FK_5d0988c5f3bdb227073985a0d84"`);
        await queryRunner.query(`ALTER TABLE "database"."answer" DROP CONSTRAINT "FK_149780a1831241afb691f1d4193"`);
        await queryRunner.query(`ALTER TABLE "database"."question" DROP CONSTRAINT "FK_c427ed013f4186f078221a1cc58"`);
        await queryRunner.query(`DROP INDEX "database"."IDX_621b0caa255d77a58c63670931"`);
        await queryRunner.query(`DROP INDEX "database"."IDX_d0c6f8343e097a4a80713d55ab"`);
        await queryRunner.query(`DROP TABLE "database"."keyword_questions_question"`);
        await queryRunner.query(`DROP TABLE "database"."answer"`);
        await queryRunner.query(`DROP TABLE "database"."user"`);
        await queryRunner.query(`DROP TABLE "database"."question"`);
        await queryRunner.query(`DROP TABLE "database"."keyword"`);
    }

}
