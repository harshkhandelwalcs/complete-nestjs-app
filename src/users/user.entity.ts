import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  // @AfterInsert()
  // logInsert() {
  //   console.log('Insert data with id:', this.id);
  // }

  // @AfterRemove()
  // logRemove() {
  //   console.log('remove data with id:', this.id);
  // }

  // @AfterUpdate()
  // logUpdate() {
  //   console.log('Update data with id:', this.id);
  // }
}
