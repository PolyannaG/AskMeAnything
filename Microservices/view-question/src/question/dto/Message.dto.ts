import {IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsObject, IsString, MaxLength} from "class-validator";
import {MessageQuestionDto} from "./message-question.dto";

export class MessageDto {
    /*
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly msg_id: number;

    @IsDateString()
    @IsNotEmpty()
    readonly msg_date: Date;

    @IsNotEmpty()
    @IsObject()
    readonly question_data: MessageQuestionDto;
     */

    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly title : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsDateString()
    @IsNotEmpty()
    readonly date_created: Date;

    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly sum_answers: number;

    @IsNumber()
    @IsNotEmpty()
    readonly Userid: number;

    @IsArray()
    @IsString({each: true})
    @MaxLength(40, {each: true})
    readonly Keywords: string[];
}