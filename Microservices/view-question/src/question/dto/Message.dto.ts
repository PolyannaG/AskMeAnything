import {IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsObject, IsString, MaxLength} from "class-validator";
import {MessageQuestionDto} from "./message-question.dto";

export class MessageDto {
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

    @IsArray()
    @IsString({each: true})
    @MaxLength(40, {each: true})
    readonly Keywords: string[];
}