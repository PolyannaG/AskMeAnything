import {MigrationInterface, QueryRunner} from "typeorm";

export class FixedConstraints1625306499956 implements MigrationInterface {
    name = 'FixedConstraints1625306499956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "title" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "text" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "text" character varying(10000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "question" ADD "title" character varying NOT NULL`);
    }

}
