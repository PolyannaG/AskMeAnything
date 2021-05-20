import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialSchema1621517255665 implements MigrationInterface {
    name = 'InitialSchema1621517255665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "create_question"."user" ("Userid" integer NOT NULL, CONSTRAINT "PK_f59cc59caef518be935b4205345" PRIMARY KEY ("Userid"))`);
        await queryRunner.query(`CREATE TABLE "create_question"."question" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying(10000) NOT NULL, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "sum_answers" integer NOT NULL DEFAULT 0, "Userid" integer NOT NULL, CONSTRAINT "PK_60feba564d25f5581606258e1ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "create_question"."keyword" ("keyword" character varying(40) NOT NULL, CONSTRAINT "PK_239fb197cabefba1ca23af0476c" PRIMARY KEY ("keyword"))`);
        await queryRunner.query(`CREATE TABLE "create_question"."keyword_questions_question" ("keywordKeyword" character varying(40) NOT NULL, "questionId" integer NOT NULL, CONSTRAINT "PK_31f316efdc685ff4d290f139635" PRIMARY KEY ("keywordKeyword", "questionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0050bece81e4a7785d327d82d6" ON "create_question"."keyword_questions_question" ("keywordKeyword") `);
        await queryRunner.query(`CREATE INDEX "IDX_ae4125f1a0afd48d4db3d871cd" ON "create_question"."keyword_questions_question" ("questionId") `);
        await queryRunner.query(`ALTER TABLE "create_question"."question" ADD CONSTRAINT "FK_1b9e75e0f2995a9604c6af262d6" FOREIGN KEY ("Userid") REFERENCES "create_question"."user"("Userid") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "create_question"."keyword_questions_question" ADD CONSTRAINT "FK_0050bece81e4a7785d327d82d61" FOREIGN KEY ("keywordKeyword") REFERENCES "create_question"."keyword"("keyword") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "create_question"."keyword_questions_question" ADD CONSTRAINT "FK_ae4125f1a0afd48d4db3d871cd2" FOREIGN KEY ("questionId") REFERENCES "create_question"."question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "create_question"."keyword_questions_question" DROP CONSTRAINT "FK_ae4125f1a0afd48d4db3d871cd2"`);
        await queryRunner.query(`ALTER TABLE "create_question"."keyword_questions_question" DROP CONSTRAINT "FK_0050bece81e4a7785d327d82d61"`);
        await queryRunner.query(`ALTER TABLE "create_question"."question" DROP CONSTRAINT "FK_1b9e75e0f2995a9604c6af262d6"`);
        await queryRunner.query(`DROP INDEX "create_question"."IDX_ae4125f1a0afd48d4db3d871cd"`);
        await queryRunner.query(`DROP INDEX "create_question"."IDX_0050bece81e4a7785d327d82d6"`);
        await queryRunner.query(`DROP TABLE "create_question"."keyword_questions_question"`);
        await queryRunner.query(`DROP TABLE "create_question"."keyword"`);
        await queryRunner.query(`DROP TABLE "create_question"."question"`);
        await queryRunner.query(`DROP TABLE "create_question"."user"`);
    }

}
