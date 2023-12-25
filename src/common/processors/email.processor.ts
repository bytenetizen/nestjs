import { Process, Processor } from '@nestjs/bull';

@Processor('appEmailQueue')
export class EmailProcessor {
  @Process('processEmail')
  async processEmail(job) {
    // Ваш код для обработки задачи в фоне
    // this.userService.createUser(job.data)
    console.log('processError processEmail data:', job.data);
    console.log(new Date().toISOString());
    // Возвращаем результат обработки
    return { status: 'success' };
  }
}
