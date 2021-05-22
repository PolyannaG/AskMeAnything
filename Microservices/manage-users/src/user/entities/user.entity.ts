import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id : number;

    @Column({length : 40})
    username : string;

    @Column()
    password : string

    @Column({length : 40})
    email : string

    @CreateDateColumn()
    user_since : Date;
}
