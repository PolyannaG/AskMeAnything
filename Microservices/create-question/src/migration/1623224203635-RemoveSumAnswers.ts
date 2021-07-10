import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveSumAnswers1623224203635 implements MigrationInterface {
    name = 'RemoveSumAnswers1623224203635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "sum_answers"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "sum_answers" integer NOT NULL DEFAULT '0'`);
    }

}
