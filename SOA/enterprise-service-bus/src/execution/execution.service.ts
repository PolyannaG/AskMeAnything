import {HttpService, Injectable, ServiceUnavailableException} from '@nestjs/common';
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
            try {
                return await this.httpService.post(url, reqBody).pipe(map(response => response.data)).pipe().toPromise();
            } catch (e) {
                throw new ServiceUnavailableException()
            }
        }
        else if (reqMethod == "get") {
            let GetUrl = url;
            for (let key in reqBody) {
                GetUrl = GetUrl + "/" + reqBody[key];
            }
            try{
                return await this.httpService.get(GetUrl).pipe(map(response => response.data)).toPromise();
            } catch (e) {
                throw new ServiceUnavailableException()
            }
        }

    }

}
