import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import  * as cookieParser from "cookie-parser";



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin : 'https://askmeanythingms.herokuapp.com',
    credentials : true,
    maxAge : 600
  });


  await app.listen(process.env.PORT || 8002);
}
bootstrap();
