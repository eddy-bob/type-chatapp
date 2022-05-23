import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity
} from "typeorm"
import { Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, MinLength } from "class-validator";
import * as bcrypt from 'bcryptjs';

import endPoint from "../config/endpoints.config"

@Entity("user")
export class User extends BaseEntity {
       @ObjectIdColumn({ generated: true })
       public id!: ObjectID;
       @Column({ type: "varchar" })
       @MinLength(3)
       public firstName!: string;
       @Column({ type: "varchar" })
       @MinLength(3)
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
       @Column({ nullable: true })
       public profilePicture!: string;
       @Column({ nullable: true })
       public address!: string;
       @Column({ type: "int", nullable: true })
       public mobile!: number;
       @Column({ type: "int" })
       zipcode!: number;
       @Column({ type: "simple-json", nullable: true, name: "user-address-details" })
       public location!: {
              streetName: string
              city: string
              streetNumber: number
              country: string
              countryCode: string
              latitude: string
              longitude: string
       }
       @CreateDateColumn()
       created_at!: Date

       @UpdateDateColumn()
       updatedDate!: Date
       @Column({ nullable: true })
       access_token!: string
       @BeforeInsert()
       async beforeInsert() {
              this.password = await bcrypt.hash(this.password, endPoint.bycriptHashRound);
              console.log(this.password)
              if (this.address != null) {
                     console.log(this.address)
              }
       }

}