import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn} from "typeorm";
import {Keyword} from "./keyword.entity";

@Entity({schema: "view_question"})
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({length : 10000})
    text: string;

    // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    //date_created: Date;

    @CreateDateColumn()
    date_created: Date;

    @Column({default: () => 0})
    sum_answers: number;

    @Column()
    Userid: number;

    @ManyToMany(type => Keyword, keyword => keyword.questions)
    keywords: Keyword[];
}