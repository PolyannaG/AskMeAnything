import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialViewAnswerSchema1621859098201 implements MigrationInterface {
    name = 'InitialViewAnswerSchema1621859098201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "view_answer"."answer" ("id" SERIAL NOT NULL, "text" text NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "userid" integer NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_3c7be8c679bfa74f17b50238700" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "view_answer"."answer"`);
    }

}
