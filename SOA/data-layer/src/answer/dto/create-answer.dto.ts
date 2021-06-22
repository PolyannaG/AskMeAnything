import {IsInt, IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsInt()
    @IsNotEmpty()
    readonly userId: number;
}