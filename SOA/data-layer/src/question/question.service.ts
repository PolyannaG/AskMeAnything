import { Injectable } from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {createQueryBuilder, EntityManager, getConnection, LessThan, Repository} from "typeorm";
import {Keyword} from "../entities/keyword.entity";
import {Question} from "../entities/question.entity";
import {CreateQuestionDto} from "./dto/create-question.dto";
import {Request} from "express";

@Injectable()
export class QuestionService {
    constructor(@InjectEntityManager() private manager : EntityManager,
                @InjectRepository(Keyword) private readonly keywordRepository : Repository<Keyword>,
                @InjectRepository(Keyword) private readonly que: Repository<Keyword>) {}

    async insertQuery(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.manager.transaction( async manager=>
    {
        //create question
        const question_to_create = {
            title: createQuestionDto.title,
            text: createQuestionDto.text,
            userId: createQuestionDto.userId
        }

        const question = await this.manager.create(Question, question_to_create);
        const question_created = await this.manager.save(question)

        if ('keywords' in createQuestionDto) {
            console.log(createQuestionDto)
            //add keywords:
            for (let i = 0; i < (createQuestionDto.keywords).length; i++) {

                //check if keyword exists
                let keyword_ret = await this.manager.findOne(Keyword, createQuestionDto.keywords[i])

                if (keyword_ret) {  // keyword exists, add relation
                    await getConnection().createQueryBuilder().relation(Keyword, "questions").of(keyword_ret).add(question)

                } else {   //keyword does not exist, we have to create it
                    let keyword_to_create = {
                        keyword: createQuestionDto.keywords[i],
                        questions: [question]
                    }
                    const keyword = this.manager.create(Keyword, keyword_to_create)
                    await this.manager.save(keyword)
                }

            }
        }

        return question_created
    });
}

    async findAllQuery(date_from: Date): Promise<Question[]> {
        return await this.manager.find(Question, {
            where: {date_created: LessThan(date_from)},
            order: {
                date_created: "DESC",
            },
            take: 10,
            relations: ["keywords"]
        });
    }

    async findAllTitlesQuery(): Promise<Question[]> {
        return await this.manager.query(`SELECT title , id FROM database.question`)

    }

    async findAllUserQuery(date_from: Date, Userid: number): Promise<Question[]> {
        return await this.manager.find(Question, {
            where: {date_created: LessThan(date_from), userId: Userid},
            take: 10,
            relations: ["keywords"]
        });
    }

    async findOneQuery(id : number): Promise<Question> {
        return await this.manager.findOne(Question, id, {relations: ["keywords"]})
    }

    async getMostPopularQuery(): Promise<Question[]> {
        return this.manager.find(Question, {order: {popularity: "DESC"}, take: 10, relations: ["keywords"]})

    }

    async filterByStartAndEndDateQuery(date_from: Date, date_to: Date): Promise<Question[]> {
        return await createQueryBuilder().select(`*`).from('question', 'Question').andWhere(`date_created < '${date_from}'`).andWhere(`date_created >= '${date_to}'`).orderBy('date_created', 'DESC').take(10).getRawMany()
    }

    async filterByStartAndEndDateUserQuery(date_from: Date, date_to: Date, Userid : number): Promise<Question[]> {
        return await createQueryBuilder().select(`*`).from('question', 'Question').andWhere(`date_created < '${date_from}'`).andWhere(`date_created >= '${date_to}'`).andWhere(`"userId" = ${Userid}`).orderBy('date_created', 'DESC').take(10).getRawMany()
    }

    async filterByKeywordDateFromQuery(keyword: String, date_from: Date): Promise<Object[]> {
        return await this.manager.query(`SELECT * FROM (SELECT * from  "database"."keyword_questions_question" as "A"  INNER JOIN "database"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"<'${date_from}' AND "A"."keywordKeyword"='${keyword}') as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)
    }

    async filterByKeywordDateFromUserQuery(keyword: String, date_from: Date, Userid : number): Promise<Object[]> {
        return await this.manager.query(`SELECT * FROM (SELECT * from  "database"."keyword_questions_question" as "A"  INNER JOIN "database"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"<'${date_from}' AND "A"."keywordKeyword"='${keyword}' AND "B"."userId"=${Userid}) as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)
    }

    async filterByKeywordDateFromToQuery(keyword: String, date_from: Date, date_to : Date): Promise<Object[]> {
        return await this.manager.query(`SELECT * FROM (SELECT * from  "database"."keyword_questions_question" as "A"  INNER JOIN "database"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"<'${date_from}' AND "B"."date_created">='${date_to}' AND "A"."keywordKeyword"='${keyword}') as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)
    }

    async filterByKeywordDateFromToUserQuery(keyword: String, date_from: Date,  date_to : Date, Userid : number): Promise<Object[]> {
        return await this.manager.query(`SELECT * FROM (SELECT * from  "database"."keyword_questions_question" as "A"  INNER JOIN "database"."question" as "B" ON "A"."questionId"="B"."id" WHERE "B"."date_created"< '${date_from}' AND "B"."date_created">='${date_to}' AND "A"."keywordKeyword"='${keyword}' AND "B"."userId"=${Userid}) as "C" ORDER BY "C"."date_created" DESC LIMIT 10`)
    }

    async findAllKeywordsQuery(): Promise<Keyword[]> {
        return await this.manager.query('SELECT * FROM database.keyword ORDER BY keyword')
    }

    async findSpecificKeywordsQuery(keyword: String): Promise<Keyword[]> {
        return await this.manager.query(`SELECT * FROM database.keyword AS A WHERE A.keyword LIKE '%${keyword}%' ORDER BY keyword`)

    }

}
