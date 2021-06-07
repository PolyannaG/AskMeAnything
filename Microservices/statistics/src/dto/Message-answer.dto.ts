import {
    IsDateString,
    IsInt,
    IsNotEmpty, IsNumber,
    IsObject,
    IsString,
    MaxLength
} from "class-validator";
import {AnswerDataDto} from "./answer-data.dto";

export class MessageAnswerDto {
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly msg_id: number;

    @IsDateString()
    @IsNotEmpty()
    readonly msg_date: Date;

    @IsObject()
    @IsNotEmpty()
    readonly answer_data: AnswerDataDto;
}