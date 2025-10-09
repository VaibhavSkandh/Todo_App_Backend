import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePasswordNullable1759835228805 implements MigrationInterface {
    name = 'MakePasswordNullable1759835228805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "isDeleted" TO "deletedAt"`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("logID" SERIAL NOT NULL, "action" character varying NOT NULL, "entityType" character varying NOT NULL, "entityID" integer NOT NULL, "details" jsonb, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userID" integer, CONSTRAINT "PK_ffb07a0dc5c30f04e699323d082" PRIMARY KEY ("logID"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" DROP NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_f29b42cab897d218ff415755741" FOREIGN KEY ("userID") REFERENCES "users"("userID") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_f29b42cab897d218ff415755741"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "deletedAt" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "deletedAt" TO "isDeleted"`);
    }

}
