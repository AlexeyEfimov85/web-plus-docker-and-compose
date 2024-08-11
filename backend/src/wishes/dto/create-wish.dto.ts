import { IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsString()
  link: string;

  @IsString()
  image: string;

  @Min(1)
  price: number;

  @IsString()
  description: string;
}
