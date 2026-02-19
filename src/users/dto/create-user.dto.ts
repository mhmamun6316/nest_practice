import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Mehedi Hasan' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'mehedi@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'admin', required: false })
  @IsOptional()
  role?: string;

  @ApiProperty({ example: '01712345678', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'Phone must be 11 digits' })
  phone?: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address?: string;
}
