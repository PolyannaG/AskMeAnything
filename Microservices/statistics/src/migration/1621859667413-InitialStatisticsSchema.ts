import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialStatisticsSchema1621859667413 implements MigrationInterface {
    name = 'InitialStatisticsSchema1621859667413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "Userid" integer NOT NULL, CONSTRAINT "PK_2a4db13987af5e4145e596ccb16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "Userid" integer NOT NULL, CONSTRAINT "PK_ddc9cf994686b187df154843b20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "keyword" ("keyword" character varying(40) NOT NULL, CONSTRAINT "PK_7dfa1f3d6a79e25e74ed3baa99f" PRIMARY KEY ("keyword"))`);
        await queryRunner.query(`CREATE TABLE "keyword_questions_question" ("keywordKeyword" character varying(40) NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_3dbe5eea6e13261cd7b3f236d59" PRIMARY KEY ("keywordKeyword", "questionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7b4cced65857442a6b384475e3" ON "keyword_questions_question" ("keywordKeyword") `);
        await queryRunner.query(`CREATE INDEX "IDX_10389f71a5ba2011dc34874de0" ON "keyword_questions_question" ("questionId") `);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_7b4cced65857442a6b384475e33" FOREIGN KEY ("keywordKeyword") REFERENCES "keyword"("keyword") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_10389f71a5ba2011dc34874de0a" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_10389f71a5ba2011dc34874de0a"`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_7b4cced65857442a6b384475e33"`);
        await queryRunner.query(`DROP INDEX "IDX_10389f71a5ba2011dc34874de0"`);
        await queryRunner.query(`DROP INDEX "IDX_7b4cced65857442a6b384475e3"`);
        await queryRunner.query(`DROP TABLE "keyword_questions_question"`);
        await queryRunner.query(`DROP TABLE "keyword"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "answer"`);
    }

}
