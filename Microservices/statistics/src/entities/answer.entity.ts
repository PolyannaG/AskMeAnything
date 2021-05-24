import {Entity} from "typeorm";
import {BaseEntity} from "./base-entity";

@Entity({schema: 'statistics'})
export class Answer extends BaseEntity {}