import { IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateCvDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    age: number;

    @IsNotEmpty()
    cin: string;

    @IsNotEmpty()
    job: string;

    @IsOptional()
    path?: string;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    skillIds?: number[];

    @IsOptional()
    @IsNumber({}, { each: true })
    userId?: number;
} 