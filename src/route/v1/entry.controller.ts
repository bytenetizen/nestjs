import { Controller, Get } from '@nestjs/common';

@Controller('entry')
export class EntryController {
  @Get()
  getEntry(): string {
    return 'Entry endpoint';
  }
}
