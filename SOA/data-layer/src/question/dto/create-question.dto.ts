import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from "class-validator";

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    readonly title : string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10000)
    readonly text : string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    @MaxLength(40, {each: true})
    readonly keywords : string[];

    @IsOptional()
    @IsNumber()
    readonly popularity : number;

    @IsNumber()
    @IsNotEmpty()
    readonly userId: number;
}