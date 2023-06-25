import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { AppConsumer } from './app.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        connectTimeout: 10000,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
        tls: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      },
    }),

    BullModule.registerQueue({
      name: process.env.QUEUE_PARSE_JSON_TO_YAML,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppConsumer],
})
export class AppModule {}
