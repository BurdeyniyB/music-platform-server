import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import 'dotenv/config';

const start = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        const app = await NestFactory.create(AppModule);

        // Дозволяємо CORS для запитів з фронтенду
        app.enableCors({
            origin: 'http://localhost:3000', // Фронтенд Next.js
            credentials: true, // Дозволяє передавати cookies, headers
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        });

        await app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start();