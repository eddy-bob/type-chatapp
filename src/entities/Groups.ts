import {
       Column, Entity, ObjectIdColumn, ObjectID, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToMany, ManyToOne, JoinColumn, OneToOne
} from "typeorm"

import { User } from "./User";

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



       @CreateDateColumn()
       created_at!: Date

       @UpdateDateColumn()
       updatedDate!: Date



}