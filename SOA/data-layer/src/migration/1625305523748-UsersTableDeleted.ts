import {MigrationInterface, QueryRunner} from "typeorm";

export class UsersTableDeleted1625305523748 implements MigrationInterface {
    name = 'UsersTableDeleted1625305523748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(40) NOT NULL, "password" character varying NOT NULL, "email" character varying(40) NOT NULL, "user_since" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1dc708bb3770cc19703311eddcf" PRIMARY KEY ("id"))`);
    }

}
