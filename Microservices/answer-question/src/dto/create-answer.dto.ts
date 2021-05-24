import {IsDate, IsInt, IsNotEmpty, IsNumber, IsString, MaxLength} from "class-validator";

export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsInt()
    @IsNotEmpty()
    readonly Userid: number;
}