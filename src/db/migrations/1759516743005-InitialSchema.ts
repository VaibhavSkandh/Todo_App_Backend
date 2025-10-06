import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1759516743005 implements MigrationInterface {
    name = 'InitialSchema1759516743005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizations" ("organizationID" SERIAL NOT NULL, "orgName" character varying(255) NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerID" integer, CONSTRAINT "PK_10b03bd990563f8aadc4ac6b0ac" PRIMARY KEY ("organizationID"))`);
        await queryRunner.query(`CREATE TABLE "users" ("userID" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(50) NOT NULL, "authProvider" character varying(50), "authProviderID" character varying(255), "passwordHash" character varying(255) NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_80b95948dfff0967ce1b3e3ae1b" PRIMARY KEY ("userID"))`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_1af2b08e895165039006b7db080" FOREIGN KEY ("ownerID") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_1af2b08e895165039006b7db080"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
    }

}
