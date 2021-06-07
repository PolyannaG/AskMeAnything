import {IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength} from "class-validator";

export class MessageQuestionDto {
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
}