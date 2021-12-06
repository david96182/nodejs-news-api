import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MonthEnum } from '../month.enum';

export class GetBlogsFilterDto {
    
    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    tag?: string;

    @IsOptional()
    @IsEnum(MonthEnum)
    month?: MonthEnum;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    skip?: number;
  }
  