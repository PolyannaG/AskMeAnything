import {MigrationInterface, QueryRunner} from "typeorm";

export class FixedConstraints1625306679196 implements MigrationInterface {
    name = 'FixedConstraints1625306679196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_users"."user" ADD CONSTRAINT "UQ_c2de56011e7a565cdd9ab8fa7c8" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "manage_users"."user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "manage_users"."user" ADD "password" character varying(500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_users"."user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "manage_users"."user" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "manage_users"."user" DROP CONSTRAINT "UQ_c2de56011e7a565cdd9ab8fa7c8"`);
    }

}
