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



@Entity()
export class Question {
    @PrimaryGeneratedColumn('increment', {type: "integer"})
    id: number;

    @Column({type: 'text', nullable:false})
    title: string;

    @Column({type: 'text', nullable: false})
    text: string;

   // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
   //date_created: Date;

    @CreateDateColumn({nullable: false})
    date_created: Date;

    //@Column({default: () => 0})
    //sum_answers: number;


    @Column({type: 'integer', nullable: false})
    Userid : number;

    @ManyToMany(type => Keyword, keyword => keyword.questions)
    keywords: Keyword[];



  //  @ManyToOne(()=>User, user=>user.questions, {nullable: false, onDelete: "CASCADE"})
  //  @JoinColumn({name : 'Userid'})
  //  user : User
}
