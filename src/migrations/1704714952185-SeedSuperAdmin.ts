import encryption from "../utils/encryption";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedSuperAdmin1704714952185 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "Users" (name, email, password, role) VALUES ('super admin', 'admin@gmail.com', '${encryption.hashData(
        "@Admin123"
      )}', 'Super Admin')` //can use env for safe
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "Users" WHERE name = 'super admin'`);
  }
}
