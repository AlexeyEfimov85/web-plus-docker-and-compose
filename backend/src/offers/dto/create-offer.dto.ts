import { IsNumber, Min } from 'class-validator';
import { Column } from 'typeorm';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  @Column()
  amount: number;

  @Column()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
