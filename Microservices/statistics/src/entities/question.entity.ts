import {Entity, ManyToMany} from "typeorm";
import {BaseEntity} from "./base-entity";
import {Keyword} from "./keyword.entity";

@Entity({schema: 'statistics'})
export class Question extends BaseEntity {
    @ManyToMany(type => Keyword, keyword => keyword.questions)
    keywords: Keyword[];
}