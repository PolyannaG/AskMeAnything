import {Entity, Column, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn} from "typeorm";
import {Question} from "./question.entity"

@Entity()
export class Answer{
    @PrimaryGeneratedColumn("increment", {type: 'integer'})
    id: number;

    @Column({type: 'text', nullable: false})
    text: string;

    @CreateDateColumn({nullable: false})
    date_created: Date;

    @Column({type: 'integer', nullable: false})
    Userid: number;

    @ManyToOne(() => Question, question => question.answers, {nullable: false, onDelete: "CASCADE"})
    @JoinColumn({name: 'questionId'})
    question: Question;
};