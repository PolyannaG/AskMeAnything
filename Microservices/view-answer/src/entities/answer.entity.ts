import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column} from "typeorm";

@Entity({schema: "view_answer"})
export class Answer {
    @PrimaryGeneratedColumn({type: 'integer'})
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