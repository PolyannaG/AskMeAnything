import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
    type: 'postgres',
    username: 'postgres',
    password: 'katerinaliaga',
    port: 5432,
    host: 'localhost',
    database: 'AskMeAnything',
    synchronize: true,
    entities: ["dist/**/*.entity{.ts,.js}"]
};