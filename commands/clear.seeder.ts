import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CvService } from '../src/cv/cv.service';

async function clearDatabase() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const cvService = app.get(CvService);
    await cvService.clearAll(); //clearAll() dans cv.service.ts vide toutes les tables: cv, skill, user
    console.log('Database cleared');
    await app.close();
}

clearDatabase();