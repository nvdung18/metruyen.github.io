import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

@ApiSchema({ description: 'Description of the CreateUserDto schema' })
export class CreateUserDto {
  @ApiProperty({
    example: 'abcxyz@gmail.com',
    uniqueItems: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  usr_email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Password is required' })
  usr_password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  usr_name: string;
}
