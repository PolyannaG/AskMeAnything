import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToMany, JoinTable} from "typeorm";
import {Question} from "./question.entity";

@Entity()
export class Keyword {
    @PrimaryColumn({type: 'varchar', length : 40})
    keyword: string;

    @ManyToMany(type => Question, question=>question.keywords)
    @JoinTable()
    questions: Question[];
}
