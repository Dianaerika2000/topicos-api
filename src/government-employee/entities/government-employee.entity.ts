import { Area } from "src/area/entities/area.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GovernmentEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  lastname: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  cellphone: string;

  @Column('text')
  photo: string;

  @Column('bool', { default: true })
  status: boolean;

  @ManyToOne(
    () => Area,
    area => area.government_employees,
    { eager: true }
  )
  area: Area;
}
