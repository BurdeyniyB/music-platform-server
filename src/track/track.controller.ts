import { Body, Controller, Get, Post } from "@nestjs/common";
import { TrackService } from "./track.service";
import { CreateTrackDto } from "./dto/create-track.dto";

@Controller("/tracks")
export class TrackController {
    constructor(private trackService: TrackService){

    }

    @Post()
    create(@Body() dto: CreateTrackDto) {
        return this.trackService.create(dto);
    }

    @Get()
    getAll() {
        return 'work'
    }


    getOne() {

    }


    delete() {

    }
}