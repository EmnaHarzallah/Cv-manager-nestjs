import { Column, Entity, JoinTable, ManyToMany, 
         ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from '../../skill/entities/skill.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  firstname!: string;

  @Column()
  age!: number;

  @Column()
  cin!: string;

  @Column()
  job!: string;

  @Column({ nullable: true })
  path!: string;

  @ManyToMany(() => Skill, (skill) => skill.cvs, { eager: true })
  @JoinTable()
  skills!: Skill[];

  @ManyToOne(() => User, (user) => user.cvs, { eager: true })
  user!: User;
}
