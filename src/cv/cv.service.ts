import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cv } from './entities/cv.entity';
import { Skill } from '../skill/entities/skill.entity';
import { User } from '../user/entities/user.entity';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

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

    async create(createCvDto: CreateCvDto): Promise<Cv> {
        const cv = this.cvRepository.create(createCvDto);

        if (createCvDto.skillIds) {
            cv.skills = await this.skillRepository.findByIds(createCvDto.skillIds);
        }

        if (createCvDto.userId) {
            const user = await this.userRepository.findOne({ where: { id: createCvDto.userId } });
            if (!user) throw new NotFoundException('Utilisateur introuvable');
            cv.user = user;
        }

        return this.cvRepository.save(cv);
    }

    async update(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
        const cv = await this.findOne(id);
        Object.assign(cv, updateCvDto);

        if (updateCvDto.skillIds) {
            cv.skills = await this.skillRepository.findByIds(updateCvDto.skillIds);
        }

        if (updateCvDto.userId) {
            const user = await this.userRepository.findOne({ where: { id: updateCvDto.userId } });
            if (!user) throw new NotFoundException('Utilisateur introuvable');
            cv.user = user;
        }

        return this.cvRepository.save(cv);
    }

    async remove(id: number): Promise<void> {
        const cv = await this.findOne(id);
        await this.cvRepository.remove(cv);
    }
} 