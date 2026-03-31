import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SkillService } from '../src/skill/skill.service';

async function seedSkills() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const skillService = app.get(SkillService);
    const skills = await skillService.createSomeFakeSkills();
    console.log(`Created ${skills.length} fake skills`);
    await app.close();
}

seedSkills();