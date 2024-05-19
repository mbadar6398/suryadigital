import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsTimeZone,
} from 'class-validator';

export class CreateUserRequestDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Lennon',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: 'john.lennon@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1996-03-09',
    description: 'User birth date with format YYYY-MM-DD',
  })
  @IsDateString()
  @IsNotEmpty()
  birth_date: string;

  @ApiProperty({
    example: 'Asia/Jakarta',
    description: 'User timezone with format Continent/City',
  })
  @IsTimeZone()
  @IsString()
  @IsNotEmpty()
  timezone: string;
}
