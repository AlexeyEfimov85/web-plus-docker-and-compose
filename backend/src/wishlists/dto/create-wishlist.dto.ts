import {
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsNumber,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @IsUrl()
  image: string;

  @IsNumber({}, { each: true })
  itemsId: number[];
}
