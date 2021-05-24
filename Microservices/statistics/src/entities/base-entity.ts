import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column} from "typeorm";

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn({type: 'integer'})
    id: number;

    @CreateDateColumn({nullable: false})
    date_created: Date;

    @Column({type: 'integer', nullable: false})
    Userid: number;
};