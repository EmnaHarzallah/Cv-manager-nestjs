import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';

async function seedUsers() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userService = app.get(UserService);
    const users = await userService.createSomeFakeUsers();
    console.log(`Created ${users.length} fake users`);
    await app.close();
}

seedUsers();