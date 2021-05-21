import {Entity, Column, ManyToOne} from "typeorm";
import {BaseEntity} from "./base-entity";
import {Question} from "./question.entity"

@Entity({ schema: "answer_question" })
export class Answer extends BaseEntity{
    @ManyToOne(() => Question, question => question.answers)
    question: Question;
};