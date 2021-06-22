import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class TokenDto {
    @IsString()
    @IsNotEmpty()
    readonly token : string
}