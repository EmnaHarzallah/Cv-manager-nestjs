import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { Skill } from '../skill/entities/skill.entity';
import { User } from '../user/entities/user.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { faker } from '@faker-js/faker';

@Injectable()
export class CvService {
    constructor(
        @InjectRepository(Cv)
        private cvRepository: Repository<Cv>,

        @InjectRepository(Skill)
        private skillRepository: Repository<Skill>,

        @InjectRepository(User)
        private userRepository: Repository<User>,  
    ) { }

    async findAll(): Promise<Cv[]> {
        return this.cvRepository.find({ relations: ['skills', 'user'] }); 
    }

    async findOne(id: number): Promise<Cv> {
        const cv = await this.cvRepository.findOne({ 
            where: { id }, 
            relations: ['skills', 'user'] 
        });
        if (!cv) throw new NotFoundException('CV introuvable');
        return cv;
    }

    async create(createCvDto: CreateCvDto, userId: number): Promise<Cv> {
        const cv = this.cvRepository.create(createCvDto);
        
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('Utilisateur introuvable');
        cv.user = user;

        if (createCvDto.skillIds) {
            cv.skills = await this.skillRepository.findByIds(createCvDto.skillIds);
        }

        return this.cvRepository.save(cv);
    }

    async update(id: number, updateCvDto: UpdateCvDto, userId: number): Promise<Cv> {
        const cv = await this.findOne(id);
        
        if (cv.user.id !== userId) {
            throw new UnauthorizedException('Vous n\'êtes pas le propriétaire de ce CV');
        }

        Object.assign(cv, updateCvDto);

        if (updateCvDto.skillIds) {
            cv.skills = await this.skillRepository.findByIds(updateCvDto.skillIds);
        }

        return this.cvRepository.save(cv);
    }

    async remove(id: number, userId: number): Promise<void> {
        const cv = await this.findOne(id);

        if (cv.user.id !== userId) {
            throw new UnauthorizedException('Vous n\'êtes pas le propriétaire de ce CV');
        }

        await this.cvRepository.remove(cv);
    }

    async clearAll(): Promise<void> {
        // Désactive les vérifications de clés étrangères pour éviter les erreurs de contrainte lors de la suppression des données
        await this.cvRepository.query('SET FOREIGN_KEY_CHECKS = 0');
        await this.cvRepository.clear();
        await this.skillRepository.clear();
        await this.userRepository.clear();
        await this.cvRepository.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    async createSomeFakeCvs(): Promise<Cv[]> {
        const cvs: Cv[] = [];
        for (let i = 0; i < 5; i++) {
            // Create fake user
            const user = this.userRepository.create({
                username: faker.internet.username(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'user'
            });
            const savedUser = await this.userRepository.save(user);

            // Create fake skills
            const skills: Skill[] = [];
            for (let j = 0; j < 3; j++) {
                const skill = this.skillRepository.create({
                    designation: faker.hacker.noun()
                });
                const savedSkill = await this.skillRepository.save(skill);
                skills.push(savedSkill);
            }

            // Create cv
            const cv = await this.create({
                name: faker.person.lastName(),
                firstname: faker.person.firstName(),
                age: faker.number.int({ min: 18, max: 65 }),
                cin: faker.number.int({ min: 10000000, max: 99999999 }).toString(),
                job: faker.person.jobTitle(),
                path: faker.system.filePath(),
                skillIds: skills.map(s => s.id)
            }, savedUser.id);
            cvs.push(cv);
        }
        return cvs;
    }
} 