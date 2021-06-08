import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import {Question} from "./question.entity";

@Entity({schema: "view_question"})
export class Keyword {
    @PrimaryColumn({length : 40})
    keyword: string;

    @ManyToMany(type => Question, question=>question.keywords)
    @JoinTable()
    questions: Question[];
}
