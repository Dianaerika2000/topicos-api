import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TypeDenunciation } from "src/type-denunciation/entities/type-denunciation.entity";
import { Auth } from "src/auth/entities/auth.entity";
import { Images } from './images.entity';

@Entity()
export class Denunciation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text', { default: 'Pendiente' })
  status: string;

  @Column('text')
  location: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  @ManyToOne(
    () => Auth,
    auth => auth.denunciations,
    { cascade: true, eager: true }
  )
  @JoinColumn()
  neighbor: Auth;

  @ManyToOne(
    () => TypeDenunciation,
    typeDenunciation => typeDenunciation.denunciations,
    { cascade: true, eager: true }
  )
  @JoinColumn()
  type_denunciation: TypeDenunciation;
  
  @OneToMany(
    () => Images,
    images => images.denunciation,
    { cascade: true, eager: true }
  )
  images?: Images[];
}
