import { IsInt } from 'class-validator';

export class CreateAuthorizationLettersProductsDto {
  @IsInt()
  id_products: number;

  @IsInt()
  id_authorization_letters: number;
}