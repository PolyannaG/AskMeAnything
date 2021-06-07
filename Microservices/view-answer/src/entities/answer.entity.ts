import {Entity, CreateDateColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Answer {
    @PrimaryColumn({type: 'integer'})
    id: number;

    @Column({type: 'text', nullable: false})
    text: string;

    @CreateDateColumn({nullable: false})
    date_created: Date;

    @Column({type: 'integer', nullable: false})
    userid: number;

    @Column({type: 'integer', nullable: false})
    questionId: number;
};