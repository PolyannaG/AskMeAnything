import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialAnswerQuestionSchema1621859723907 implements MigrationInterface {
    name = 'InitialAnswerQuestionSchema1621859723907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer_question"."question" ("id" SERIAL NOT NULL, CONSTRAINT "PK_c3d19a72538eb388759ee112b54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer_question"."answer" ("id" SERIAL NOT NULL, "text" text NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "Userid" integer NOT NULL, "questionId" integer, CONSTRAINT "PK_c83eb039005df898a9fd9ce7b6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answer_question"."answer" ADD CONSTRAINT "FK_5ab5ffed332002f679485fee404" FOREIGN KEY ("questionId") REFERENCES "answer_question"."question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_question"."answer" DROP CONSTRAINT "FK_5ab5ffed332002f679485fee404"`);
        await queryRunner.query(`DROP TABLE "answer_question"."answer"`);
        await queryRunner.query(`DROP TABLE "answer_question"."question"`);
    }

}
