import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, ManyToOne, JoinColumn
} from "typeorm"

import { User } from "./User";
import { Group } from "./Groups";


@Entity("group-message")
export class GroupMessage extends BaseEntity {
       @ObjectIdColumn({ generated: true })
       id!: ObjectID;


       @ManyToOne(() => Group,
              (group) => { group.messages }
       )

       @JoinColumn({ name: "group" })
       group!: Group


       @ManyToOne(() => User
       )
       @JoinColumn({ name: "messsage-sender" })
       sender!: User


       @Column()
       message!: string
       @CreateDateColumn()
       created_at!: Date

       @UpdateDateColumn()
       updatedDate!: Date



}