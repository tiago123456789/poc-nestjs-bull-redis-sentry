import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { AppConsumer } from './app.consumer';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { NextFunction, Request, Response } from 'express';

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

    BullBoardModule.forRoot({
      route: '/queues',
      middleware: (
        request: Request,
        response: Response,
        next: NextFunction,
      ) => {
        const ipAddress = request.socket.remoteAddress;

        const ipAllowed =
          process.env.IP_ALLOW_ACCESS_QUEUE_BOARD.split(',') || [];
        if (ipAllowed.indexOf(ipAddress) === -1) {
          return response.sendStatus(401);
        }

        next();
      },
      adapter: ExpressAdapter,
    }),

    BullBoardModule.forFeature({
      name: process.env.QUEUE_PARSE_JSON_TO_YAML,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppConsumer],
})
export class AppModule {}
