import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DataToTransformDto } from './data-to-transform.dto';
import * as YAML from 'json-to-pretty-yaml';

@Processor(process.env.QUEUE_PARSE_JSON_TO_YAML)
export class AppConsumer {
  @Process()
  async handle(job: Job<DataToTransformDto>) {
    const json = JSON.parse(job.data.data);
    const data = YAML.stringify(json);
    console.log(data);
    return;
  }
}
