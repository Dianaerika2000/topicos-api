
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Denunciation } from "./denunciation.entity";
@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(
    () => Denunciation,
    denunciation => denunciation.notifications,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn()
  denunciation?: Denunciation;
}
