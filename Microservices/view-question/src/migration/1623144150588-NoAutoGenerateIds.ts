import {MigrationInterface, QueryRunner} from "typeorm";

export class NoAutoGenerateIds1623144150588 implements MigrationInterface {
    name = 'NoAutoGenerateIds1623144150588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_8cecd2211197dc655db48afe18e"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "question_id_seq"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "sum_answers" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_8cecd2211197dc655db48afe18e" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" DROP CONSTRAINT "FK_8cecd2211197dc655db48afe18e"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "sum_answers" SET DEFAULT '0'`);
        await queryRunner.query(`CREATE SEQUENCE "question_id_seq" OWNED BY "question"."id"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" SET DEFAULT nextval('question_id_seq')`);
        await queryRunner.query(`ALTER TABLE "keyword_questions_question" ADD CONSTRAINT "FK_8cecd2211197dc655db48afe18e" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
