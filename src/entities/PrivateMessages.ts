import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, ManyToOne, JoinColumn
} from "typeorm"

import { User } from "./User";

@Entity("private-message")
export class PrivateMessage extends BaseEntity {
       @ObjectIdColumn({ generated: true })
       id!: ObjectID;

       @Column({ type: "varchar" })
       message!: string
       @ManyToOne(() => User,
              (user) => { user.messages }
       )

       @JoinColumn({ name: "messsage-sender" })
       sender!: User

       @JoinColumn({ name: "messsage-reciever" })
       reciever!: User

       @CreateDateColumn()
       created_at!: Date

       @UpdateDateColumn()
       updatedDate!: Date



}