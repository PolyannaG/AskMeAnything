import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn({type: 'integer'})
    id: number;

    @Column({type: 'text', nullable: false})
    text: string;

    @Column({type: 'timestamp', nullable: false})
    date_created: Date;

    @Column({type: 'integer', nullable: false})
    userid: number;
};