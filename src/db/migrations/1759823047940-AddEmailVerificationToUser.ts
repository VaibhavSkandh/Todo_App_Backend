import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationToUser1759823047940 implements MigrationInterface {
    name = 'AddEmailVerificationToUser1759823047940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "emailVerificationToken" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authProvider"`);
        await queryRunner.query(`CREATE TYPE "public"."users_authprovider_enum" AS ENUM('email', 'google', 'microsoft')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "authProvider" "public"."users_authprovider_enum" NOT NULL DEFAULT 'email'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'suspended')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" "public"."users_status_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" character varying(20) NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authProvider"`);
        await queryRunner.query(`DROP TYPE "public"."users_authprovider_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "authProvider" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerificationToken"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isEmailVerified"`);
    }

}
