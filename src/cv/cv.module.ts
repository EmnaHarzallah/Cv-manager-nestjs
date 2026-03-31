import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './entities/cv.entity';
import { Skill } from '../skill/entities/skill.entity';
import { User } from '../user/entities/user.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Cv, Skill,User]), // <- Ajouter Skill ici
    ],
    controllers: [CvController],
    providers: [CvService],
})
export class CvModule {}
 