import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BeforeInsert, BaseEntity, OneToMany, ManyToOne, JoinColumn
} from "typeorm"
import { IsEmail, MinLength } from "class-validator";


import { Group } from "./Groups";
import { User } from "./User";


@Entity("friend-request")
export class FriendRequest extends BaseEntity {
       @ObjectIdColumn({ generated: true })
       id!: ObjectID;

       @Column({ type: "varchar" })
       @MinLength(3)
       firstName!: string;

       @Column({ type: "varchar" })
       @MinLength(3)
       lastName!: string;


       @Column({ unique: true, })
       @IsEmail()
       email!: string;

       @Column({ nullable: true })
       profilePicture!: string;

       @Column({ type: "int", nullable: true })
       mobile!: number;

       @Column({ nullable: true })
       city!: string

       @Column({ nullable: true })
       country!: string

       @Column({ nullable: true })
       countryCode!: number

       @Column({ nullable: true })
       state!: string

       @ManyToOne(() => User,
              (user) => user.friendRequests

       )

       @JoinColumn({ name: "request-sender" })
       requestSender!: User

       @JoinColumn({ name: "request-reciever" })
       requestReciever!: User



       @CreateDateColumn()
       created_at!: Date

       @UpdateDateColumn()
       updatedDate!: Date


       @BeforeInsert()
       async beforeInsert() {
              console.log()

       }

}