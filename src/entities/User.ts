import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity, OneToOne, OneToMany
} from "typeorm"
import { IsEmail, MinLength } from "class-validator";
import * as bcrypt from 'bcryptjs';

import endPoint from "../config/endpoints.config"
import { PrivateMessage } from "./PrivateMessages";

// define enum
enum UserEnum {
       USER = "USER",
       ADMIN = "ADMIN",
       MODERATOR = "MODERATOR"

}
@Entity("user")
export class User extends BaseEntity {
       @ObjectIdColumn({ generated: true })
       id!: ObjectID;

       @Column({ type: "varchar" })
       @MinLength(3)
       firstName!: string;

       @Column({ type: "varchar" })
       @MinLength(3)
       lastName!: string;

       @Column({ select: false })
       password!: string;

       @Column({ unique: true })
       @IsEmail()
       email!: string;

       @Column({ type: "boolean", default: false })
       isLoggedIn!: boolean;
       @Column({ type: "enum", enum: UserEnum, default: "USER" })
       role!: string;
       @Column({ nullable: true })
       profilePicture!: string;

       @Column({ type: "int", nullable: true })
       mobile!: number;

       @Column({ type: "int" })
       zipcode!: number;

       @Column({ type: "geometry", nullable: true, name: "user-address-details" })
       location!: {
              coordinates: number[]
              formattedAddress: string
              street: string
              city: string
              streetNumber: number
              country: string
              countryCode: string
              state: string

       }

       @Column({ nullable: true })
       access_token!: string

       @OneToMany(() => PrivateMessage,
              (message) => message.sender

       )
       messages!: PrivateMessage

       @CreateDateColumn()
       created_at!: Date

       @UpdateDateColumn()
       updatedDate!: Date


       @BeforeInsert()
       async beforeInsert() {
              this.password = await bcrypt.hash(this.password, endPoint.bycriptHashRound);
              console.log(this.password)


       }

}