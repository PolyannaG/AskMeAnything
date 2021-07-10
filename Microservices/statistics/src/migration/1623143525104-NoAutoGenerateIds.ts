import {MigrationInterface, QueryRunner} from "typeorm";

export class NoAutoGenerateIds1623143525104 implements MigrationInterface {
    name = 'NoAutoGenerateIds1623143525104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "answer_id_seq"`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_10389f71a5ba2011dc34874de0a"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "question_id_seq"`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_10389f71a5ba2011dc34874de0a" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_10389f71a5ba2011dc34874de0a"`);
        await queryRunner.query(`CREATE SEQUENCE "question_id_seq" OWNED BY "question"."id"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" SET DEFAULT nextval('statistics.question_id_seq')`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_10389f71a5ba2011dc34874de0a" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE SEQUENCE "answer_id_seq" OWNED BY "answer"."id"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "id" SET DEFAULT nextval('statistics.answer_id_seq')`);
    }

}
