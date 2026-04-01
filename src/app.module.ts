import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './cv/entities/cv.entity';
import { User } from './user/entities/user.entity';
import { Skill } from './skill/entities/skill.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { UserModule } from './user/user.module';
import { SkillModule } from './skill/skill.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [//contient les modules dont mon module a besoin pour fonctionner
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306, //port mysql
      username: 'cv_user',
      password: 'cv-pass',
      database: 'cv_db',
      entities: [Cv, User, Skill],
      synchronize: true,//met à jour la base de données en fonction des entités à chaque démarrage de l'application (ne pas utiliser en production)
    }),
    CvModule,
    UserModule,
    SkillModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
