import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

import { TaskModel, StatusRole } from '@/models/task';
import TaskList from './task-list';

@Entity('tasks')
class Task implements TaskModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: StatusRole,
    default: StatusRole.not_started,
  })
  status: StatusRole;

  @Column()
  duration: number;

  @Column({ type: 'date', nullable: true })
  started_at?: Date;

  @Column({ type: 'date', nullable: true })
  due_date?: Date;

  @Column({ type: 'integer', nullable: true })
  dependency_id?: number | null | undefined;

  @OneToOne(() => Task)
  @JoinColumn({ name: 'dependency_id' })
  dependency: Task;

  @Column()
  task_list_id: number;

  @ManyToOne(() => TaskList)
  @JoinColumn({ name: 'task_list_id' })
  taskList: TaskList;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Task;
