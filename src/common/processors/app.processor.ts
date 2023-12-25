import { Process, Processor } from '@nestjs/bull';
import { LogErrorService } from '../../realization/error/log.error.service';
@Processor('appQueue')
export class AppProcessor {
  constructor(private readonly logErrorService: LogErrorService) {}
  @Process('processError')
  async processError(job: any) {
    // console.log('processError AppProcessor data:', job.data);
    // console.log(new Date().toISOString());
    // Возвращаем результат обработки
    this.logErrorService.create(job.data);
    return { status: 'success' };
  }
}
