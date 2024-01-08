import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user/user.entity";
import { SeedSuperAdmin1704714952185 } from "./migrations/1704714952185-SeedSuperAdmin";

export default new DataSource({
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "qwertyui",
  database: "bhumio",
  synchronize: process.env.NODE_ENV !== "production",
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [SeedSuperAdmin1704714952185],
  type: "postgres",
});
