import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BeforeInsert
} from "typeorm"
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max } from "class-validator";
import * as bcrypt from 'bcryptjs';

import endPoint from "../config/endpoints.config"

@Entity()
export class User {
       @ObjectIdColumn({ generated: true })
       public id!: ObjectID;
       @Column({ length: 200, type: "varchar" })
       public firstName!: string;

       @Column({ length: 200, type: "varchar" })
       public lastName!: string;

       @Column({ select: false })
       public password!: string;

       @Column({ unique: true })
       @IsEmail()
       public email!: string;

       @Column({ type: "boolean", default: false })
       public isLoggedIn!: boolean;
       @Column({ type: "varchar", enum: ["USER", "ADMIN", "MODERATOR"], default: "USER" })
       public role!: string;

       @Column()
       public profilePicture!: string;

       @Column()
       public address!: string;
       @Column({ type: "int" })
       zipcode!: number;

       @Column()
       public mobile!: number;
       @CreateDateColumn()
       createdDate!: Date


       @UpdateDateColumn()
       updatedDate!: Date

       @BeforeInsert()
       async beforeInsert() {
              this.password = await bcrypt.hash(this.password, endPoint.bycriptHashRound);
              console.log(this.password)
       }

}