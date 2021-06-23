import {IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, MaxLength} from "class-validator";
import {ServiceDto} from "./service.dto";

export class ManagementBodyDto {
    @IsString()
    @IsNotEmpty()
    readonly name : string;

    @IsUrl()
    @IsString()
    @IsNotEmpty()
    readonly address : string;

    @IsString()
    @IsNotEmpty()
    readonly description : string;
    
    @IsArray()
    @IsObject({each: true})
    readonly services : ServiceDto[];

}