import { randomUUID } from 'crypto';

import { Email } from '../value-objects/email.value-object';

interface UserProps {
  firstName: string;
  lastName: string;
  email: Email;
  passwordHash: string;
  createdAt?: Date;
}

export class User {
  private readonly _id: string;
  private readonly _props: UserProps;

  private constructor(props: UserProps, id?: string) {
    this._id = id ?? randomUUID();
    this._props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public static create(props: UserProps): User {
    if (!props.firstName) {
      throw new Error('First name is required');
    }
    if (!props.lastName) {
      throw new Error('Last name is required');
    }
    if (!props.email) {
      throw new Error('Email is required');
    }
    if (!props.passwordHash) {
      throw new Error('Password is required');
    }
    return new User(props);
  }

  public static reconstitute(props: UserProps, id: string): User {
    return new User(props, id);
  }

  public toJson(): Record<string, unknown> {
    return {
      id: this._id,
      firstName: this._props.firstName,
      lastName: this._props.lastName,
      email: this._props.email.toString(),
      createdAt: this._props.createdAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get firstName(): string {
    return this._props.firstName;
  }

  get lastName(): string {
    return this._props.lastName;
  }

  get email(): Email {
    return this._props.email;
  }

  get createdAt(): Date {
    return this._props.createdAt ?? new Date();
  }
}
