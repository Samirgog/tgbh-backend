import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class BaseDto {
  @Field(() => ID)
  id: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
