import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTable1759997271748 implements MigrationInterface {
    name = 'CreateTasksTable1759997271748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("taskID" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" character varying(20) NOT NULL DEFAULT 'pending', "importance" character varying(20) NOT NULL DEFAULT 'normal', "dueDate" TIMESTAMP, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "listID" integer, "createdBy" integer, "updatedBy" integer, "parentTaskID" integer, CONSTRAINT "PK_0559e1d609700de0feaec94256d" PRIMARY KEY ("taskID"))`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_4f1a71e3b2cf6475514ecabb148" FOREIGN KEY ("listID") REFERENCES "lists"("listID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_97dd6125cba9c54b7c6cd02b080" FOREIGN KEY ("createdBy") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_02f55e7a79d4203b3e3f67b2ddd" FOREIGN KEY ("updatedBy") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_c75a39ce7413903490fe2b41173" FOREIGN KEY ("parentTaskID") REFERENCES "tasks"("taskID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_c75a39ce7413903490fe2b41173"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_02f55e7a79d4203b3e3f67b2ddd"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_97dd6125cba9c54b7c6cd02b080"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_4f1a71e3b2cf6475514ecabb148"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
