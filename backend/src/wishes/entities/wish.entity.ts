import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entities';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsString()
  @MinLength(1)
  @MaxLength(250)
  @IsNotEmpty()
  @Column()
  name: string;

  @IsString()
  @Column()
  link: string;

  @IsString()
  @Column()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Column()
  price: number;

  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  @Column()
  description: string;

  @Column({ default: 0 })
  @IsInt()
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
