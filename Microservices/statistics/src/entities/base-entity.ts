import {Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export class BaseEntity {
    @PrimaryColumn({type: 'integer'})
    id: number;

    @CreateDateColumn({nullable: false})
    date_created: Date;

    @Column({type: 'integer', nullable: false})
    Userid: number;
};