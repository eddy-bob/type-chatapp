import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, ManyToOne, JoinColumn, OneToOne, OneToMany
} from "typeorm"

import { User } from "./User";
import { GroupMessage } from "./GroupMessages";


@Entity("group")
export class Group extends BaseEntity {
       @ObjectIdColumn({ generated: true })
       id!: ObjectID;

       @Column({ unique: true })
       name!: string

       @Column()
       description!: string

       @Column()
       photo!: string

       @ManyToOne(() => User,
              (user) => { user.groups }
       )

       @JoinColumn({ name: "group-owner" })
       owner!: User

       @OneToMany(() => GroupMessage,
              (groupmessage) => { groupmessage.group }
       )

       messages!: GroupMessage
       @CreateDateColumn()
       created_at!: Date

       @UpdateDateColumn()
       updatedDate!: Date



}