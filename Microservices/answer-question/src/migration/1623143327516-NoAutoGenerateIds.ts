import {MigrationInterface, QueryRunner} from "typeorm";

export class NoAutoGenerateIds1623143327516 implements MigrationInterface {
    name = 'NoAutoGenerateIds1623143327516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5ab5ffed332002f679485fee404"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "question_id_seq"`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5ab5ffed332002f679485fee404" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE"answer" DROP CONSTRAINT "FK_5ab5ffed332002f679485fee404"`);
        await queryRunner.query(`CREATE SEQUENCE "question_id_seq" OWNED BY "question"."id"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" SET DEFAULT nextval('answer_question.question_id_seq')`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5ab5ffed332002f679485fee404" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
