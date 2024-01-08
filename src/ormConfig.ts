import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "./entities/user/user.entity";

const config: TypeOrmModuleOptions = {
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "qwertyui",
  database: "bhumio",
  synchronize: process.env.NODE_ENV !== "production",
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
  type: "postgres",
};

export default config;

