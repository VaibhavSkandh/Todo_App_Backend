import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1759574518847 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1759574518847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "hashedRefreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "hashedRefreshToken"`);
    }

}
