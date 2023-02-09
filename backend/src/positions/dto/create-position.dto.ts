import { IsNotEmpty } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty({ message: 'Provide position name' })
  readonly name: string;
}
