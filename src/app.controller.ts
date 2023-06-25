import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DataToTransformDto } from './data-to-transform.dto';
import { AppErrorInterceptor } from './app-error.interceptor';

@UseInterceptors(AppErrorInterceptor)
@Controller()
export class AppController {
  constructor(
    @InjectQueue(process.env.QUEUE_PARSE_JSON_TO_YAML)
    private parseJsonToYamlQueue: Queue,
  ) {}

  @Get('/generate-error')
  generateError() {
    throw new Error('Error generated to test sentry');
  }

  @Post('/publish')
  @HttpCode(202)
  async publishToJsonQueue(@Body() dataToTransform: DataToTransformDto) {
    try {
      console.log('passed on here');
      await this.parseJsonToYamlQueue.add(dataToTransform);
    } catch (error) {
      console.log(error);
    }
  }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
