import {Entity, Column} from "typeorm";
import {question} from "./question.entity"
import {BaseEntity} from "./base-entity";

@Entity({ schema: "answer_question" })
export class answer extends BaseEntity{
    @Column({type: 'integer', nullable: false})
    questionid: number;
};