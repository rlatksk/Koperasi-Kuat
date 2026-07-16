import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sequence_counter')
export class SequenceCounter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  prefix: string;

  @Column({ type: 'int', default: 0 })
  last_number: number;
}
