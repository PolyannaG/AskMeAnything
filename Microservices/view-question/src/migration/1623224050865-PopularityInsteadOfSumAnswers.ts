import {MigrationInterface, QueryRunner} from "typeorm";

export class PopularityInsteadOfSumAnswers1623224050865 implements MigrationInterface {
    name = 'PopularityInsteadOfSumAnswers1623224050865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "view_question"."question" RENAME COLUMN "sum_answers" TO "popularity"`);
        await queryRunner.query(`ALTER TABLE "view_question"."question" ALTER COLUMN "popularity" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "view_question"."question" ALTER COLUMN "popularity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "view_question"."question" RENAME COLUMN "popularity" TO "sum_answers"`);
    }

}
