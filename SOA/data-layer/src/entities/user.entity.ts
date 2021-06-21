import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Answer} from "./answer.entity";
import {Question} from "./question.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id : number;

    @Column({length : 40, nullable: false})
    username : string;

    @Column({nullable: false})
    password : string

    @Column({length : 40, nullable: false})
    email : string

    @CreateDateColumn()
    user_since : Date;

    @OneToMany(() => Answer, answer => answer.user)
    answers: Answer[];

    @OneToMany(() => Question, question => question.user)
    questions: Question[];
};