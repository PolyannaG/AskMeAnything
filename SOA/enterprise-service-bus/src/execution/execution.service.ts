import {HttpService, Injectable} from '@nestjs/common';
import {ServiceDto} from "./dto/service.dto";
import {map} from "rxjs/operators";

@Injectable()
export class ExecutionService {
    constructor(private httpService: HttpService) {}
    
    async execute(body: ServiceDto): Promise<any> {
        let url = body.url;
        let reqMethod = body.requestMethod;
        let reqBody = body.params;
        
        //in our app we use only post and get requests
        if (reqMethod == "post") {
            return await this.httpService.post(url, reqBody).pipe(map(response => response.data)).toPromise();
        }
        else if (reqMethod == "get") {
            let GetUrl = url;
            for (let key in reqBody) {
                GetUrl = GetUrl + "/" + reqBody[key];
            }
            return await this.httpService.get(GetUrl).pipe(map(response => response.data)).toPromise();
        }
    }
}
