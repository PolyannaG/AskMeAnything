import {Entity, JoinTable, ManyToMany, PrimaryColumn} from "typeorm";
import {Question} from "./question.entity";

@Entity({schema: 'statistics'})
export class Keyword {
    @PrimaryColumn({length: 40})
    keyword: string;

    @ManyToMany(type => Question, question=>question.keywords)
    @JoinTable()
    questions: Question[];
}