import {IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsObject, IsString, MaxLength} from "class-validator";
import {QuestionDataDto} from "./question-data.dto";

export class MessageQuestionDto {
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly msg_id: number;

    @IsDateString()
    @IsNotEmpty()
    readonly msg_date: Date;

    @IsNotEmpty()
    @IsObject()
    readonly question_data: QuestionDataDto;

    @IsArray()
    @IsString({each: true})
    @MaxLength(40, {each: true})
    readonly Keywords: string[];
}