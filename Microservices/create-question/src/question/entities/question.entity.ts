import {
    Entity,
    Column,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    ManyToMany,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";
import {Keyword} from "./keyword.entity";
import {User} from "./user.entity";


@Entity()
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


    @ManyToMany(type => Keyword, keyword => keyword.questions)
    keywords: Keyword[];

    @ManyToOne(()=>User, user=>user.questions, {nullable: false, onDelete: "CASCADE"})
    @JoinColumn({name : 'Userid'})
    user : User
}
