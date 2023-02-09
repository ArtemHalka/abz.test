import { Type } from 'class-transformer';
import { IsNotEmpty, IsEmail, Matches, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: "Provide user's name" })
  readonly name: string;

  @IsEmail({}, { message: 'Email is invalid' })
  @IsNotEmpty({ message: "Provide user's email" })
  readonly email: string;

  @Matches(/^[\+]{0,1}380([0-9]{9})$/, {
    message: 'User phone number should start with code of Ukraine +380',
  })
  @IsNotEmpty({ message: "Provide user's phone" })
  readonly phone: string;

  @Min(1, { message: "User's position is invalid" })
  @Type(() => Number)
  @IsNotEmpty({ message: "Provide user's position" })
  readonly positionId: number;
}
