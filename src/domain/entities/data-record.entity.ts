import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class DataRecord extends BaseEntity {
  constructor(partial: Partial<DataRecord>) {
    super();
    Object.assign(this, partial);
  }

  @Column({ type: 'int' })
  postId!: number;

  @Column({ type: 'int' })
  recordId!: number;

  @Column({ type: 'varchar', length: 250 })
  name!: string;

  @Column({ type: 'varchar', length: 250 })
  email!: string;

  @Column({ type: 'text' })
  body!: string;
}
