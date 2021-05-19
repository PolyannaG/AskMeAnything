import {Entity, Column} from "typeorm";
import {BaseEntity} from "./base-entity";

@Entity({ schema: "answer_question" })
export class question extends BaseEntity{
    @Column({type: 'varchar', length: 255 ,nullable: true, default: null})
    title: string;

    @Column({type: 'integer', nullable: true, default: null})
    num_answers: number;
};