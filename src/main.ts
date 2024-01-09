import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { baseUrl } from "./constant";
import * as session from "express-session";
import { initialize, session as passportSession } from "passport";
import { ForbiddenException } from "@nestjs/common";
import { config } from "dotenv";
import helmet from "helmet";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
  );

  app.enableCors({
    origin(requestOrigin, callback) {
      const whiteList = process.env.CORS_LIST ?? "";
      if (whiteList.indexOf(requestOrigin as string) !== -1) {
        callback(null, true);
      } else {
        callback(
          new ForbiddenException(`Not allowed by CORS for URL ${requestOrigin}`)
        );
      }
    },
  });

  app.use(
    helmet({
      referrerPolicy: { policy: "same-origin" },
    })
  );

  app.setGlobalPrefix(baseUrl);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
