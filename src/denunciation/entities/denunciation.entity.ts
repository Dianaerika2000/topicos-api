import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypeDenunciation } from "src/type-denunciation/entities/type-denunciation.entity";
import { Auth } from "src/auth/entities/auth.entity";

@Entity()
export class Denunciation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  @Column({ type: 'jsonb', array: false, nullable: false })
  images: string;

  @Column('text', { default: 'Pendiente' })
  status: string;

  @Column('text')
  location: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  @ManyToOne(
    () => Auth,
    auth => auth.denunciations,
  )
  @JoinColumn()
  neighbor: Auth;

  @ManyToOne(
    () => TypeDenunciation,
    typeDenunciation => typeDenunciation.denunciations,
    { cascade: true }
  )
  @JoinColumn()
  type_denunciation: TypeDenunciation;
}
