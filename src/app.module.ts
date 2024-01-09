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

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    JwtModule,
    UserModule,
    MorganModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    },
  ],
})
export class AppModule {}
