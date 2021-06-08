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
    readonly id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsDateString()
    @IsNotEmpty()
    readonly date_created: Date;

    @IsInt()
    @IsNumber()
    @IsNotEmpty()
    readonly Userid: number;

    @IsObject()
    @IsNotEmpty()
    readonly question: object;

    /*@IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly msg_id: number;

    @IsDateString()
    @IsNotEmpty()
    readonly msg_date: Date;

    @IsObject()
    @IsNotEmpty()
    readonly answer_data: MessageAnswerDto;
     */
}