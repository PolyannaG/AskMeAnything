import {Entity, Column, OneToMany} from "typeorm";
import {BaseEntity} from "./base-entity";
import {Answer} from "./answer.entity";

@Entity({ schema: "answer_question" })
export class Question extends BaseEntity{
    @Column({type: 'varchar', length: 255 ,nullable: true, default: null})
    title: string;

    @Column({type: 'integer', nullable: true, default: null})
    num_answers: number;

    @OneToMany(() => Answer, answer => answer.question)
    answers: Answer[];
};