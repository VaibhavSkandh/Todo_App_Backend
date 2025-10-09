import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateListsTable1759995803157 implements MigrationInterface {
    name = 'CreateListsTable1759995803157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lists" ("listID" SERIAL NOT NULL, "listName" character varying(255) NOT NULL, "visibility" character varying(20) NOT NULL DEFAULT 'private', "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerUserID" integer, "organizationID" integer, CONSTRAINT "PK_ddecfc1e948172fe6eb48aee30d" PRIMARY KEY ("listID"))`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_f54a4b5ebaff8ec40351bce86f3" FOREIGN KEY ("ownerUserID") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_d465ae72e3829069c7319c34b5b" FOREIGN KEY ("organizationID") REFERENCES "organizations"("organizationID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_d465ae72e3829069c7319c34b5b"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_f54a4b5ebaff8ec40351bce86f3"`);
        await queryRunner.query(`DROP TABLE "lists"`);
    }

}
