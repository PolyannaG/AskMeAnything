import {MigrationInterface, QueryRunner} from "typeorm";

export class UserIDAddition1621108274990 implements MigrationInterface {
    name = 'UserIDAddition1621108274990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "create_question"."question" ADD "Userid" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "create_question"."question" ALTER COLUMN "sum_answers" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "create_question"."question" ALTER COLUMN "sum_answers" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "create_question"."question" DROP COLUMN "Userid"`);
    }

}
