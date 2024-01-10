import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import ormConfig from "./ormConfig";
import { UserModule } from "./app/user/user.module";
import { MorganModule, MorganInterceptor } from "nest-morgan";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AuthModule } from "./app/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { AdminModule } from "./app/admin/admin.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    JwtModule,
    UserModule,
    MorganModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined", {
        skip: () => process.env.NODE_ENV === "test",
      }),
    },
  ],
})
export class AppModule {}
