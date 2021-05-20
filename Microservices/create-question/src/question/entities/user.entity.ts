import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToMany, JoinTable} from "typeorm";
import {Question} from "./question.entity";


@Entity()
export class User {
    @PrimaryColumn()
    Userid : number

    @OneToMany(type => Question, question=>question.user)
    questions: Question[];
}
