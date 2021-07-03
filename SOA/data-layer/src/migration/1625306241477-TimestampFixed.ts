import {MigrationInterface, QueryRunner} from "typeorm";

export class TimestampFixed1625306241477 implements MigrationInterface {
    name = 'TimestampFixed1625306241477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "database"."question" ALTER COLUMN "popularity" SET DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "database"."question" ALTER COLUMN "popularity" SET DEFAULT '0'`);
    }

}
