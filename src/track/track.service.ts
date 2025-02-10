import { Model, ObjectId, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Track } from './schemas/track.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class TrackService {
    constructor(
        @InjectModel(Track.name) private trackModel: Model<Track>,
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        private fileService: FileService
    ) {}

    async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
        try {
            console.log(dto);
            const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
            const imagePath = this.fileService.createFile(FileType.IMAGE, picture);
            const track = await this.trackModel.create({ ...dto, listens: 0, picture: imagePath, audio: audioPath });
            return track;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create track', error.message);
        }
    }

    async getAll(count = 6): Promise<Track[]> {
        try {
            const tracks = await this.trackModel.find().limit(count);
            return tracks;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch tracks', error.message);
        }
    }

    async search(query: string): Promise<Track[]> {
        const tracks = await this.trackModel.find({
            $or: [
                { name: { $regex: new RegExp(query, 'i') } },
                { artist: { $regex: new RegExp(query, 'i') } }
            ]
        });
        return tracks;
    }    

    async getOne(id: ObjectId): Promise<Track> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid track ID');
        }
        const track = (await this.trackModel.findById(id)).populate('comments');
        if (!track) {
            throw new NotFoundException('Track not found');
        }
        return track;
    }

    async put(id: ObjectId, dto: CreateTrackDto): Promise<Track> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid track ID');
        }
        try {
            const updatedTrack = await this.trackModel.findByIdAndUpdate(
                id,
                { $set: dto },
                { new: true }
            ).exec();
            if (!updatedTrack) {
                throw new NotFoundException('Track not found');
            }
            return updatedTrack;
        } catch (error) {
            throw new InternalServerErrorException('Failed to update track', error.message);
        }
    }

    async delete(id: ObjectId): Promise<ObjectId> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid track ID');
        }
        const track = await this.trackModel.findByIdAndDelete(id);
        this.fileService.removeFile(track.picture);
        this.fileService.removeFile(track.audio);

        if (!track) {
            throw new NotFoundException('Track not found');
        }
        return track.id;
    }

    async addComment(dto: CreateCommentDto): Promise<Comment> {
        if (!isValidObjectId(dto.trackId)) {
            throw new BadRequestException('Invalid track ID');
        }
        const track = await this.trackModel.findById(dto.trackId);
        if (!track) {
            throw new NotFoundException('Track not found for the given ID');
        }
        try {
            const comment = await this.commentModel.create({ ...dto });
            track.comments.push(comment.id);
            await track.save();
            return comment;
        } catch (error) {
            throw new InternalServerErrorException('Failed to create comment', error.message);
        }
    }

    async linsten(id: ObjectId){
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid track ID');
        }
        const track = await this.trackModel.findById(id);
        if (!track) {
            throw new NotFoundException('Track not found for the given ID');
        }
        try {
            track.listens += 1;
            await track.save()
        } catch (error) {
            throw new InternalServerErrorException('Failed to increase listening', error.message);
        }
    }
}
