import { User } from './user.entity';

export class Role {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
}
