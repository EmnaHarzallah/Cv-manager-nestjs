import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CvService } from '../src/cv/cv.service';

async function seedCvs() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const cvService = app.get(CvService);
    const cvs = await cvService.createSomeFakeCvs();
    console.log(`Created ${cvs.length} fake CVs`);
    await app.close();
}

seedCvs();