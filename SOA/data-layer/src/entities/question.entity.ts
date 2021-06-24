import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Keyword} from "./keyword.entity";
import {Answer} from "./answer.entity";
import {User} from "./user.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({nullable: false})
    title: string;

    @Column({length : 10000, nullable: false})
    text: string;

    @CreateDateColumn()
    date_created: Date;

    @Column({default: () => 0})
    popularity: number;

    @OneToMany(() => Answer, answer => answer.question)
    answers: Answer[];

    @ManyToOne(()=> User, user => user.questions, {nullable: false, onDelete: "CASCADE"})
    user: User;

    @ManyToMany(type => Keyword, keyword => keyword.questions)
    keywords: Keyword[];
};