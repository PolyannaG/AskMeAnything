import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {Keyword} from "./keyword.entity";
import {Answer} from "./answer.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn("increment", {type: 'integer'})
    id: number;

    @Column({type: 'text', nullable: false})
    title: string;

    @Column({type: 'text', nullable: false})
    text: string;

    @CreateDateColumn({nullable: false})
    date_created: Date;

    @Column({type: 'integer', default: () => 0})
    popularity: number;

    @Column({type: 'integer', nullable: false})
    userId: number;

    //@ManyToOne(()=> User, user => user.questions, {nullable: false, onDelete: "CASCADE"})
    //@JoinColumn({name: 'userId'})
    //user: User;

    @OneToMany(() => Answer, answer => answer.question)
    answers: Answer[];

    @ManyToMany(type => Keyword, keyword => keyword.questions)
    keywords: Keyword[];
};