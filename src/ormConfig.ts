import { type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "./entities/user/user.entity";
import { Group } from "./entities/group/group.entity";
import { UserGroup } from "./entities/userGroup/userGroup.entity";

const config: TypeOrmModuleOptions = {
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "qwertyui",
  database: "bhumio",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "test",
  entities: [User,Group,UserGroup],
  subscribers: [],
  migrations: [],
  type: "postgres",
  connectTimeoutMS: 30000,
  
};

export default config;

