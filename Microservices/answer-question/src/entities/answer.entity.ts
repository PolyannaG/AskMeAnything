import {Entity, Column} from "typeorm";
import {BaseEntity} from "./base-entity";

@Entity({ schema: "answer_question" })
export class answer extends BaseEntity{
    @Column({type: 'integer', nullable: false})
    questionid: number;
};