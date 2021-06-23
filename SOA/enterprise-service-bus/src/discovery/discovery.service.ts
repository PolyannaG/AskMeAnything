import {HttpService, Injectable} from '@nestjs/common';
import {RedisService} from "nestjs-redis";
import {map} from "rxjs/operators";
import {response} from "express";

@Injectable()
export class DiscoveryService {
    private client: any;
    constructor(private httpService: HttpService,
                private redisService: RedisService) {
        this.getClient();
    }
    private async getClient() {
        this.client = await this.redisService.getClient();
    }

    async getAllProvidedServices(): Promise<Object[]> {
        let registered = await this.httpService.get("http://localhost:8010/management/allRegistered").pipe(map(response =>response.data)).toPromise();
        let services = [];

        if (registered != null ) {
            for (let i = 0; i < registered.length; i++) {
                if (registered[i]["services"] != []) {
                    for (let j = 0; j < registered[i]["services"].length; j++) {
                        services.push(registered[i]["services"][j]);
                    }
                }
            }
        }
        console.log(services);
        return services;
    }
}
