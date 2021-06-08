import {IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from "class-validator";

export class SendQuestionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly title : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsNumber()
    @IsNotEmpty()
    readonly Userid: number;

    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly id: number;

    @IsDateString()
    @IsNotEmpty()
    readonly date_created: Date;

    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly sum_answers: number;

    @IsArray()
    @IsString({each: true})
    @MaxLength(40, {each: true})
    readonly Keywords: string[];
}