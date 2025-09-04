export type UserProps = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export class User {
  constructor(private props: UserProps) {}

  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get createdAt() {
    return this.props.createdAt;
  }
}
