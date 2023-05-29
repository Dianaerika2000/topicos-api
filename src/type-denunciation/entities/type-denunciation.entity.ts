import { Denunciation } from "src/denunciation/entities/denunciation.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
}
