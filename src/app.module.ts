import { MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './ormConfig';
import { UserModule } from './app/user/user.module';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './app/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './app/admin/admin.module';
import { GroupModule } from './app/group/group.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './utils/email';
import { UrlEncodedParser } from './middlewares/urlEncodedParser';
import { config } from "dotenv";

config()

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    JwtModule,
    UserModule,
    MorganModule,
    AuthModule,
    AdminModule,
    GroupModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined', {
        skip: () => process.env.NODE_ENV === 'test',
      }),
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UrlEncodedParser).forRoutes('*');
  }
}
