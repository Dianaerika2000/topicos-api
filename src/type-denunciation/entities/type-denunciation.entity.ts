import { Area } from "src/area/entities/area.entity";
import { Denunciation } from "src/denunciation/entities/denunciation.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TypeDenunciation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @OneToMany(
    () => Denunciation,
    denunciation => denunciation.type_denunciation,
  )
  denunciations?: Denunciation[];

  @OneToOne(
    () => Area,
    area => area.type_denunciation,
  )
  @JoinColumn()
  area: Area;
}
