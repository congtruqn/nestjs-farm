import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';

export class BaseEntity {
  @Column({
    name: 'created_datetime',
    type: 'timestamp with time zone',
  })
  createdDateTime?: Date;

  @Column({
    name: 'updated_datetime',
    type: 'timestamp with time zone',
  })
  updatedDateTime?: Date;

  @BeforeInsert()
  save() {
    const date = new Date();
    this.createdDateTime = date;
    this.updatedDateTime = date;
  }

  @BeforeUpdate()
  update() {
    const date = new Date();
    this.updatedDateTime = date;
  }
}
