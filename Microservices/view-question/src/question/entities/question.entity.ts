import {Entity, Column, PrimaryColumn, ManyToMany, CreateDateColumn} from "typeorm";
import {Keyword} from "./keyword.entity";

@Entity({schema: "view_question"})
export class Question {
    @PrimaryColumn({type: 'integer'})
    id: number;

    @Column({type: 'text', nullable: false})
    title: string;

    @Column({type: 'text', nullable: false})
    text: string;

    // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    //date_created: Date;

    @CreateDateColumn({nullable: false})
    date_created: Date;

    @Column({type: 'integer', default: () => 0})
    popularity: number;

    @Column({type: 'integer', nullable: false})
    Userid: number;

    @ManyToMany(type => Keyword, keyword => keyword.questions)
    keywords: Keyword[];
}