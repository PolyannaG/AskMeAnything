import {
    IsDateString,
    IsInt,
    IsNotEmpty, IsNumber,
    IsObject,
    IsString,
    MaxLength
} from "class-validator";

export class SendAnswerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsInt()
    @IsNumber()
    @IsNotEmpty()
    readonly Userid: number;

    @IsObject()
    @IsNotEmpty()
    readonly question: object;

    /*@IsNotEmpty()
    readonly question: QuestionDto;*/

    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly id: number;

    @IsDateString()
    @IsNotEmpty()
    readonly date_created: Date;
}