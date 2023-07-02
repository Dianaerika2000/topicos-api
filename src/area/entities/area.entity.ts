import { GovernmentEmployee } from "src/government-employee/entities/government-employee.entity";
import { TypeDenunciation } from "src/type-denunciation/entities/type-denunciation.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  location: string;

  @Column('text')
  cellphone: string;

  @OneToOne(
    () => TypeDenunciation,
    type_denunciation => type_denunciation.area,
    { cascade: true }
  )
  type_denunciation: TypeDenunciation;

  @OneToMany(
    () => GovernmentEmployee,
    government_employee => government_employee.area,
    { cascade: true }
  )
  government_employees: GovernmentEmployee[];
}
