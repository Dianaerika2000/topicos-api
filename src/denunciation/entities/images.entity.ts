import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Denunciation } from "./denunciation.entity";


@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    () => Denunciation,
    denunciation => denunciation.images,
  )
  @JoinColumn()
  denunciation: Denunciation;

}