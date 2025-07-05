import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AuthInput {
    @Field({ description: 'Данные инициализации от Телеграма' })
    @IsString()
    initData: string;
}
