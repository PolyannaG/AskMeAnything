import {IsDefined, IsInt, IsNotEmpty} from "class-validator";

export class paramIdDto {
    @IsDefined()
    @IsInt()
    @IsNotEmpty()
    id : number;
}