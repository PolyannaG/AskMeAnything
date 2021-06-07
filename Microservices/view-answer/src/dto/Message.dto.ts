import {
    IsDateString,
    IsInt,
    IsNotEmpty, IsNumber,
    IsObject,
    IsString,
    MaxLength
} from "class-validator";
import {MessageAnswerDto} from "./message-answer.dto";

export class MessageDto {
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly msg_id: number;

    @IsDateString()
    @IsNotEmpty()
    readonly msg_date: Date;

    @IsObject()
    @IsNotEmpty()
    readonly answer_data: MessageAnswerDto;
}