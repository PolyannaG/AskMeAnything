import {MigrationInterface, QueryRunner} from "typeorm";

export class FixedConstraints1625306447664 implements MigrationInterface {
    name = 'FixedConstraints1625306447664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5ab5ffed332002f679485fee404"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "questionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5ab5ffed332002f679485fee404" FOREIGN KEY ("questionId") REFERENCES"question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5ab5ffed332002f679485fee404"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "questionId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5ab5ffed332002f679485fee404" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
