import {MigrationInterface, QueryRunner} from "typeorm";

export class ViewAnswerSchema1623083020076 implements MigrationInterface {
    name = 'ViewAnswerSchema1623083020076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "view_answer"."answer" ("id" integer NOT NULL, "text" text NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "userid" integer NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_3c7be8c679bfa74f17b50238700" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "view_answer"."answer"`);
    }

}
