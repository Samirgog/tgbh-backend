import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [],
})
export class CommonModule {}
