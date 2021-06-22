import {Entity, CreateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {User} from "./user.entity";
import {Question} from "./question.entity";

@Entity()
export class Answer {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({length: 10000, nullable: false})
    text: string;

    @CreateDateColumn()
    date_created: Date;

    @ManyToOne(() => User, user => user.answers)
    user: User;

    @ManyToOne(() => Question, question => question.answers)
    question: Question;
};