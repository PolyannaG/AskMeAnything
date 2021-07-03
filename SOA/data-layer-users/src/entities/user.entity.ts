import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment", {type: "integer"})
    id : number;

    @Column({type: 'varchar', length : 40, unique: true, nullable: false})
    username : string;

    @Column({type: 'varchar', length : 500, nullable: false})
    password : string

    @Column({type: 'varchar', length : 40, nullable: false})
    email : string

    @CreateDateColumn({nullable: false})
    user_since : Date;

    //@OneToMany(() => Answer, answer => answer.user)
    //answers: Answer[];

    //@OneToMany(() => Question, question => question.user)
    //questions: Question[];
};