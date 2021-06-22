import {HttpService, Injectable, NotFoundException} from '@nestjs/common';
import {map} from "rxjs/operators";

@Injectable()
export class AnswerService {
    constructor(private httpService: HttpService) {}

    async create (paramId: number, createAnswerDto: object) : Promise<Object[]> {
        const myQuestion = await this.httpService.get("http://localhost:8006/answer/checkForQuestion",
            {params: {
                        "id": paramId
                    }
            })
            .pipe(map(response => response.data))
            .toPromise();

        if (!myQuestion)
            throw new NotFoundException(`Question with id ${paramId} not found, so it can't be answered`);
        else {
            const created_answer = await this.httpService.post("http://localhost:8006/answer/createAnswer",
                {params: {
                            "id": paramId
                        },
                    body: createAnswerDto
                })
                .pipe(map(response => response.data))
                .toPromise();

            return created_answer
        }

    }

    async findQuestionAnswers(QuestionID : number): Promise<Object[]> {

        const question_answers = await this.httpService.get("http://localhost:8006/answer/findQuestionAnswers",
            {params: {
                    "id": QuestionID
                }
            })
            .pipe(map(response => response.data))
            .toPromise();

        if (question_answers == [])
            return [
                {
                    id: QuestionID,
                    answers: []
                }
            ];

        else
            return [
                {
                    id: QuestionID,
                    answers: question_answers
                }
            ];
    }

    async findAnswersForUser(UserID : number): Promise<Object[]> {
        const my_answers = await this.httpService.get("http://localhost:8006/answer/findAnswersForUser",
            {params: {
                    "UserID": UserID
                }
            })
            .pipe(map(response => response.data))
            .toPromise();

        if (my_answers == [])
            return [
                {
                    userID: UserID,
                    answers: []
                }
            ];

        else
            return [
                {
                    userID: UserID,
                    answers: my_answers
                }
            ];
    }

    async findAllDate(date_from: Date, userid: number): Promise<Object[]> {
        const ans = await this.httpService.get("http://localhost:8006/answer/findAllDate",
            {params: {
                    "date_from": date_from,
                    "userid": userid
                }
            })
            .pipe(map(response => response.data))
            .toPromise();

        if (!ans || ans.length == 0)
            throw new NotFoundException(`No answers found earlier than date ${date_from} found.`)
        return ans
    }
}
