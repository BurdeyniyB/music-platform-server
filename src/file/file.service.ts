import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
    AUDIO = 'audio',
    IMAGE = 'image'
}

@Injectable()
export class FileService {
    createFile(type: FileType, file): string {
        try {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = uuid.v4() + "." + fileExtension;

            const filePaths = [
                path.resolve(__dirname, '..', '..', 'static', type), 
                path.resolve(__dirname, '..', 'static', type)      
            ];

            for (const filePath of filePaths) {
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, { recursive: true });
                }

                fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
            }

            return type + '/' + fileName;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    removeFile(fileName: string) {
        const filePaths = [
            path.resolve(__dirname, '..', '..', 'static', fileName), 
            path.resolve(__dirname, '..', 'static', fileName)        
        ];

        for (const filePath of filePaths) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            } else {
                console.warn(`file ${filePath} didn't found.`);
            }
        }
    }
}
