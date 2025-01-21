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
            // Get file extension and generate a unique file name
            const fileExtension = file.originalname.split('.').pop();
            const fileName = uuid.v4() + "." + fileExtension;

            // Define an array of file paths
            const filePaths = [
                path.resolve(__dirname, '..', '..', 'static', type),  // Global file path
                path.resolve(__dirname, '..', 'static', type)         // Local file path
            ];

            // Iterate over each file path and perform operations
            for (const filePath of filePaths) {
                // Create directory for each file path if it doesn't exist
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, { recursive: true });
                }

                // Write file to the current file path
                fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
            }

            // Return the relative path of the file
            return type + '/' + fileName;
        } catch (e) {
            // Throw an error if something goes wrong
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    removeFile(fileName: string) {
        // Define an array of file paths to remove the file from
        const filePaths = [
            path.resolve(__dirname, '..', '..', 'static', fileName),  // Global file path
            path.resolve(__dirname, '..', 'static', fileName)         // Local file path
        ];

        // Iterate over each file path and remove the file if it exists
        for (const filePath of filePaths) {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }
}
