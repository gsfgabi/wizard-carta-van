import { IsInt } from 'class-validator';

export class CreateAuthorizationLettersVanTypesDto {
  @IsInt()
  id_van_types: number;

  @IsInt()
  id_authorization_letters: number;
}