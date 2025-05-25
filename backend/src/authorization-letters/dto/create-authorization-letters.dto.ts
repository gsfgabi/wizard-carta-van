import { IsNotEmpty, IsEmail, IsNumberString, Length } from 'class-validator';

export class CreateAuthorizationLettersDto {
  @IsNumberString()
  @Length(14, 14)
  cnpj: string;

  @IsNotEmpty()
  corporate_name: string;

  @IsNotEmpty()
  responsible_person_name: string;

  @IsNotEmpty()
  responsible_person_title: string;

  @IsNumberString()
  responsible_person_cellphone: string;

  @IsEmail()
  responsible_person_email: string;

  @IsNotEmpty()
  manager_name: string;

  @IsNumberString()
  manager_cellphone: string;

  @IsEmail()
  manager_email: string;

  @IsNumberString()
  branch_number: string;

  branch_dv: string;

  @IsNumberString()
  account_number: string;

  account_dv: string;

  @IsNumberString()
  agreement_number: string;

  @IsNumberString()
  id_banks: string;

  @IsNumberString()
  id_cnabs: string;
}