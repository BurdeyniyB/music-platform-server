import { Module } from "@nestjs/common";
import { TrackModule } from "./track/track.module";
import { MongooseModule } from "@nestjs/mongoose"
import 'dotenv/config';

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.ay61d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`),
        TrackModule
    ]
})
export class AppModule { }