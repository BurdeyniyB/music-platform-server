import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Track } from './schemas/track.schema';
import { CreateTrackDto } from './dto/create-track.dto'
import { Comment } from './schemas/comment.schema';


@Injectable()
export class TrackService {
    constructor(@InjectModel(Track.name) private trackModel: Model<Track>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>) { }

    async create(dto: CreateTrackDto): Promise<Track> {
        const track = await this.trackModel.create({...dto, listens: 0})
        return track;
    }

    async getAll() {

    }

    async getOne() {

    }

    async delete() {

    }
}