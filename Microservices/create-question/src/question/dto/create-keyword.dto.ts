import {IsString, IsNotEmpty, IsNumber, MaxLength} from 'class-validator'

export class CreateKeywordDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    readonly keyword: string;

    @IsNumber()
    @IsNotEmpty()
    @MaxLength(10)
    readonly questionID: number;
}
