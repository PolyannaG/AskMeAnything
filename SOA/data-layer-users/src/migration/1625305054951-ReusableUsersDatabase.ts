import {MigrationInterface, QueryRunner} from "typeorm";

export class ReusableUsersDatabase1625305054951 implements MigrationInterface {
    name = 'ReusableUsersDatabase1625305054951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(40) NOT NULL, "password" character varying(500) NOT NULL, "email" character varying(40) NOT NULL, "user_since" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b75b17f36f1b000823ddac45946" UNIQUE ("username"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
