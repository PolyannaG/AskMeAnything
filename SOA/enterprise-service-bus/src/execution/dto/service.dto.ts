import {IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, MaxLength} from "class-validator";

export class ServiceDto {
    @IsString()
    @IsNotEmpty()
    readonly name : string;

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    readonly url : string;

    @IsString()
    @IsNotEmpty()
    readonly requestMethod : string;

    @IsArray()
    @IsObject()
    readonly params : object;

}