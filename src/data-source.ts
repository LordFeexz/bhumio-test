import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user/user.entity";
import { SeedSuperAdmin1704714952185 } from "./migrations/1704714952185-SeedSuperAdmin";
import { Group } from "./entities/group/group.entity";
import { UserGroup } from "./entities/userGroup/userGroup.entity";
import { Transaction } from "./entities/transaction/transaction.entity";

export default new DataSource({
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "qwertyui",
  database: "bhumio",
  synchronize: process.env.NODE_ENV !== "production",
  logging: true,
  entities: [User, Group, UserGroup, Transaction],
  migrations: [SeedSuperAdmin1704714952185],
  type: "postgres",
  connectTimeoutMS: 30000,
});
