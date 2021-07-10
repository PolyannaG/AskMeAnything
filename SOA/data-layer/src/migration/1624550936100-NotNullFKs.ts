import {MigrationInterface, QueryRunner} from "typeorm";

export class NotNullFKs1624550936100 implements MigrationInterface {
    name = 'NotNullFKs1624550936100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5d0988c5f3bdb227073985a0d84"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_c427ed013f4186f078221a1cc58"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "popularity" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_149780a1831241afb691f1d4193"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "questionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_c427ed013f4186f078221a1cc58" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_149780a1831241afb691f1d4193" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5d0988c5f3bdb227073985a0d84" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5d0988c5f3bdb227073985a0d84"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_149780a1831241afb691f1d4193"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_c427ed013f4186f078221a1cc58"`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "questionId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_149780a1831241afb691f1d4193" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "popularity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_c427ed013f4186f078221a1cc58" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5d0988c5f3bdb227073985a0d84" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
