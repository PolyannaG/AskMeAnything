import {MigrationInterface, QueryRunner} from "typeorm";

export class FixedConstraintsUsersRemoved1625305233972 implements MigrationInterface {
    name = 'FixedConstraintsUsersRemoved1625305233972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "database"."question" DROP CONSTRAINT "FK_c427ed013f4186f078221a1cc58"`);
        await queryRunner.query(`ALTER TABLE "database"."answer" DROP CONSTRAINT "FK_149780a1831241afb691f1d4193"`);
        await queryRunner.query(`ALTER TABLE "database"."question" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "database"."question" ADD "title" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "database"."question" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "database"."question" ADD "text" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "database"."question" ALTER COLUMN "popularity" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "database"."answer" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "database"."answer" ADD "text" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "database"."answer" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "database"."answer" ADD "text" character varying(10000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "database"."question" ALTER COLUMN "popularity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "database"."question" DROP COLUMN "text"`);
        await queryRunner.query(`ALTER TABLE "database"."question" ADD "text" character varying(10000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "database"."question" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "database"."question" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "database"."answer" ADD CONSTRAINT "FK_149780a1831241afb691f1d4193" FOREIGN KEY ("userId") REFERENCES "database"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "database"."question" ADD CONSTRAINT "FK_c427ed013f4186f078221a1cc58" FOREIGN KEY ("userId") REFERENCES "database"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
