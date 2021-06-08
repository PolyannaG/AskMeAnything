import {IsInt, IsNotEmpty, IsNumber} from "class-validator";

export class QuestionDto {
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    readonly id: number;
}