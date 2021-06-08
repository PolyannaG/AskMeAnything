import {MigrationInterface, QueryRunner} from "typeorm";

export class NoAutoGenerateIds1623143327516 implements MigrationInterface {
    name = 'NoAutoGenerateIds1623143327516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_question"."answer" DROP CONSTRAINT "FK_5ab5ffed332002f679485fee404"`);
        await queryRunner.query(`ALTER TABLE "answer_question"."question" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "answer_question"."question_id_seq"`);
        await queryRunner.query(`ALTER TABLE "answer_question"."answer" ADD CONSTRAINT "FK_5ab5ffed332002f679485fee404" FOREIGN KEY ("questionId") REFERENCES "answer_question"."question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_question"."answer" DROP CONSTRAINT "FK_5ab5ffed332002f679485fee404"`);
        await queryRunner.query(`CREATE SEQUENCE "answer_question"."question_id_seq" OWNED BY "answer_question"."question"."id"`);
        await queryRunner.query(`ALTER TABLE "answer_question"."question" ALTER COLUMN "id" SET DEFAULT nextval('answer_question.question_id_seq')`);
        await queryRunner.query(`ALTER TABLE "answer_question"."answer" ADD CONSTRAINT "FK_5ab5ffed332002f679485fee404" FOREIGN KEY ("questionId") REFERENCES "answer_question"."question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
