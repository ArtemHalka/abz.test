import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Position } from '../positions/position.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  photo: string;

  @ManyToOne(() => Position, (position) => position.users)
  position: Position;
}
