import {MigrationInterface, QueryRunner} from "typeorm";

export class changepasswordlength1621420327990 implements MigrationInterface {
    name = 'changepasswordlength1621420327990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_users"."user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "manage_users"."user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "manage_users"."user" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "manage_users"."user" ADD "password" character varying(40) NOT NULL`);
    }

}
