import {Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Answer} from "./answer.entity";

@Entity()
export class Question{
    @PrimaryColumn({type: "integer"})
    id: number;

    @OneToMany(() => Answer, answer => answer.question)
    answers: Answer[];
};