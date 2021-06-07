import {Entity, Column, PrimaryColumn, ManyToMany, CreateDateColumn} from "typeorm";
import {Keyword} from "./keyword.entity";

@Entity()
export class Question {
    @PrimaryColumn()
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