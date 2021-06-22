import {HttpService, Injectable} from '@nestjs/common';
import {RedisService} from "nestjs-redis";
import {ManagementBodyDto} from "./dto/management-body.dto";

@Injectable()
export class ManagementService {
    private client: any;
    constructor(private httpService: HttpService,
                private redisService: RedisService) {
        this.getClient();
    }
    private async getClient() {
        this.client = await this.redisService.getClient();
    }

    async activateSubscription(subscriberInfo : ManagementBodyDto): Promise<boolean> {
        let sub = await this.client.hget('registered');
        let subscribers = JSON.parse(sub);
        let myAddress = subscriberInfo.address;
        let alreadySubscribed = false;

        if (subscribers == null){
            subscribers = [];
            subscribers[0] = subscriberInfo;
            await this.client.hset('registered' , JSON.stringify(subscribers));
            return true
        }
        else {
            for (let i = 0; i < subscribers.length; i++) {
                if (subscribers[i].address == myAddress)
                    alreadySubscribed = true;
            }
            if (alreadySubscribed == false) {
                subscribers.push(subscriberInfo);
                await this.client.hset('registered', JSON.stringify(subscribers));
                return true
            }
            else
                return true
        }
    }

    async stopSubscription(subscriberAddress : ManagementBodyDto): Promise<boolean> {
        let sub = await this.client.hget('registered');
        let subscribers = JSON.parse(sub);
        let myAddress = subscriberAddress.address;
        let newSubscribers = [];

        if (subscribers != null)
        {
            for (let i = 0; i < subscribers.length; i++) {
                if (subscribers[i].address != myAddress)
                    newSubscribers.push(subscribers[i]);
            }

            await this.client.hset('registered', JSON.stringify(newSubscribers));
            return true

        }
        else
            return true
    }

    async updateSubscribers(): Promise<any> {
        let unsub = await this.client.hget('lost', 'unregistrations');
        let sub = await this.client.hget('lost', 'registrations');
        let subscribe = JSON.parse(sub);
        let unsubscribe = JSON.parse(unsub);

        if (unsubscribe != null) {
            for (let i = 0; i < unsubscribe.length; i++) {
                await this.stopSubscription(unsubscribe[i]);
            }
            await this.client.hset('lost', 'unregistrations', JSON.stringify([]));
        }

        if (subscribe != null) {
            for (let i = 0; i < subscribe.length; i++) {
                await this.activateSubscription(subscribe[i]);
            }
            await this.client.hset('lost', 'registrations', JSON.stringify([]));
        }

        return "Registers Updated";
    }

    async getAllSubscribers(): Promise<Object>{
        let sub = await this.client.hget('registered');
        let resp = JSON.parse(sub);
        return resp
    }
    
}
