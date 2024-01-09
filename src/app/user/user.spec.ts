import { Test, type TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { User } from "../../entities/user/user.entity";
import encryption from "../../utils/encryption";
import * as request from "supertest";
import { type INestApplication } from "@nestjs/common";
import { AppModule } from "../../app.module";
import { config } from "dotenv";
import { UserService } from "./user.service";

config();

describe("User Module", () => {
  let controler: UserController;
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controler = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    app = module.createNestApplication();
    await app.init();
  });

  describe("Service", () => {
    beforeAll(async () => {
      await User.query(
        `INSERT INTO "Users" (name, email, password, role) VALUES ('usserrnew', 'user@gmail.com', '${encryption.hashData(
          "@Users123"
        )}', 'User')`
      );
    });

    afterAll(async () => {
      await User.query(`DELETE FROM "Users" WHERE name = 'usserrnew'`);
    });

    it("findOneByEmail should return null / falsy", async () => {
      const data = await userService.findOneByEmail("test@gmail.com");

      expect(data).toBeFalsy();
    });

    it("findOneByEmail should return User", async () => {
      const data = await userService.findOneByEmail("user@gmail.com");

      expect(data).toHaveProperty("password", expect.any(String));
      expect(data).toHaveProperty("email", expect.any(String));
      expect(data).toHaveProperty("role", expect.any(String));
      expect(data).toHaveProperty("id", expect.any(String));
    });

    it("createSession should return token string", async () => {
      const user = await userService.findOneByEmail("user@gmail.com");
      const token = userService.createSession(user);

      expect(token).toBeTruthy();
    });
  });

  //controller
  describe("login", () => {
    const url = "/user/login";
    beforeAll(async () => {
      await User.query(
        `INSERT INTO "Users" (name, email, password, role) VALUES ('usserr', 'user@gmail.com', '${encryption.hashData(
          "@Users123"
        )}', 'User')`
      );
    });

    afterAll(async () => {
      await User.query(`DELETE FROM "Users" WHERE name = 'usserr'`);
    });

    it("should return bad request", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(url)
        .send({});

      expect(status).toBe(400);
      expect(body).toHaveProperty("message", expect.any(String));
    });

    it("should return unauthorized", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(url)
        .send({
          email: "test123@gmail.com",
          password: "@Qwertyui123",
        });

      expect(status).toBe(401);
      expect(body).toHaveProperty("message", expect.any(String));
    });

    it("should return OK", async () => {
      const { body, status } = await request(app.getHttpServer())
        .post(url)
        .send({
          email: "user@gmail.com",
          password: "@Users123",
        });

      expect(status).toBe(200);
      expect(body).toHaveProperty("data", expect.any(String));
    });
  });
});
