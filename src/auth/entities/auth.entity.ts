import e from 'express';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    apellido: string;
    
    @Column('text')
    ci: string;

    @Column('text')
    direccion: string;
    
    @Column('text')
    telefono: string;
    
    @Column('text', { unique: true })
    correo: string;

    @Column('text')
    contrasenia: string;

    @Column('text')
    foto: string;

    
}
