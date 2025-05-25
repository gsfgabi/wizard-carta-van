import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthorizationLettersService } from './authorization-letters.service';
import { CreateAuthorizationLettersDto } from './dto/create-authorization-letters.dto';
import { CreateAuthorizationLettersProductsDto } from './dto/create-authorization-letters-products.dto';
import { CreateAuthorizationLettersVanTypesDto } from './dto/create-authorization-letters-van-types.dto';
import { convertBigIntToString } from 'src/utils/bigint.helper';


@Controller('forms')
export class AuthorizationLettersController {
  constructor(private readonly authService: AuthorizationLettersService) {}

  @Post('form-authorization-letters')
  async saveAuthorizationLetters(
    @Body() createFormAuthorizationLettersDto: CreateAuthorizationLettersDto
  ) {
    const result = await this.authService.saveAuthorizationLetters(createFormAuthorizationLettersDto);
    return convertBigIntToString(result);
  }

  @Get('form-authorization-letters')
  async getAllAuthorizationLetters() {
    const result = await this.authService.getAllAuthorizationLetters();
    return result.map(convertBigIntToString);
  }

  @Get('form-authorization-letters/:id')
  async getAuthorizationLetterById(@Param('id') id: string) {
    const result = await this.authService.getAuthorizationLetterById(Number(id));
    return convertBigIntToString(result);
  }

  @Post('form-authorization-letters-products')
  async saveAuthorizationLettersProducts(
    @Body() createFormAuthorizationLettersProductsDto: CreateAuthorizationLettersProductsDto
  ) {
    const result = await this.authService.saveAuthorizationLettersProducts(createFormAuthorizationLettersProductsDto);
    return convertBigIntToString(result);
  }

  @Post('form-authorization-letters-van-types')
  async saveAuthorizationLettersVanTypes(
    @Body() createFormAuthorizationLettersVanTypesDto: CreateAuthorizationLettersVanTypesDto
  ) {
    const result = await this.authService.saveAuthorizationLettersVanTypes(createFormAuthorizationLettersVanTypesDto);
    return convertBigIntToString(result);
  }
}