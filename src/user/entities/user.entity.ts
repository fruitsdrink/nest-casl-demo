export class User {
  constructor(user?: Partial<User>) {
    if (user) {
      Object.assign(this, user);
    }
  }
  id: number;
  isAdmin: boolean;
  orgId: number;
}
