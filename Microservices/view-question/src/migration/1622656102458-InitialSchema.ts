import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSchema1622656102458 implements MigrationInterface {
    name = 'InitialSchema1622656102458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying(10000) NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "sum_answers" integer NOT NULL DEFAULT 0, "Userid" integer NOT NULL, CONSTRAINT "PK_d01559c2a6df9f5f7281b488a14" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "keyword" ("keyword" character varying(40) NOT NULL, CONSTRAINT "PK_1bdeb1bdb0199faf8fc62afb1b0" PRIMARY KEY ("keyword"))`);
        await queryRunner.query(`CREATE TABLE "keyword_questions_question" ("keywordKeyword" character varying(40) NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_d86e198fe149d8eee6ed10fac59" PRIMARY KEY ("keywordKeyword", "questionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_63be0034e375fa961a8d85b70e" ON "keyword_questions_question" ("keywordKeyword") `);
        await queryRunner.query(`CREATE INDEX "IDX_8cecd2211197dc655db48afe18" ON "keyword_questions_question" ("questionId") `);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_63be0034e375fa961a8d85b70e8" FOREIGN KEY ("keywordKeyword") REFERENCES "keyword"("keyword") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_8cecd2211197dc655db48afe18e" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_8cecd2211197dc655db48afe18e"`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_63be0034e375fa961a8d85b70e8"`);
        await queryRunner.query(`DROP INDEX "IDX_8cecd2211197dc655db48afe18"`);
        await queryRunner.query(`DROP INDEX "IDX_63be0034e375fa961a8d85b70e"`);
        await queryRunner.query(`DROP TABLE "keyword_questions_question"`);
        await queryRunner.query(`DROP TABLE "keyword"`);
        await queryRunner.query(`DROP TABLE "question"`);
    }

}
