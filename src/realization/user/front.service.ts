import { Injectable } from '@nestjs/common';

@Injectable()
export class FrontService {
  extractUserFields(user: any): {
    id: string;
    name: string;
    lastname: string;
    gender: number;
  } {
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      gender: user.gender,
    };
  }

  extractUserTokenFields(user: any): {
    id: string;
    name: string;
    gender: number;
  } {
    return {
      id: user.id,
      name: user.name,
      gender: user.gender,
    };
  }
}
