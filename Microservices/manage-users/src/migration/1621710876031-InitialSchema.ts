import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSchema1621710876031 implements MigrationInterface {
    name = 'InitialSchema1621710876031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "manage_users"."user" ("id" SERIAL NOT NULL, "username" character varying(40) NOT NULL, "password" character varying NOT NULL, "email" character varying(40) NOT NULL, "user_since" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_315e576e3c8316d1224b32da4b7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "manage_users"."user"`);
    }

}
