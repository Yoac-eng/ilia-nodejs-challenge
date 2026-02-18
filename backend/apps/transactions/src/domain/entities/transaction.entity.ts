import { randomUUID } from 'crypto';

import { TransactionType } from '../enum/transaction-type.enum';
import { Amount } from '../value-objects/amount.value-object';

interface TransactionProps {
  userId: string;
  type: TransactionType;
  description?: string;
  amount: Amount;
  idempotencyKey?: string;
  createdAt?: Date;
}

export class Transaction {
  private readonly _id: string;
  private readonly _props: TransactionProps;

  private constructor(props: TransactionProps, id?: string) {
    this._id = id ?? randomUUID();
    this._props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  public static create(props: TransactionProps): Transaction {
    if (!props.userId) {
      throw new Error('User ID is required');
    }
    if (!Object.values(TransactionType).includes(props.type)) {
      throw new Error('Invalid type');
    }
    if (!props.amount) {
      throw new Error('Amount is required');
    }
    // if (!this._props.idempotencyKey) {
    //   throw new Error('Idempotency key is required');
    // }
    return new Transaction(props);
  }

  public static reconstitute(props: TransactionProps, id: string): Transaction {
    return new Transaction(props, id);
  }

  public toJson(): Record<string, unknown> {
    return {
      id: this._id,
      userId: this._props.userId,
      type: this._props.type,
      description: this._props.description,
      amount: Number(this._props.amount.cents),
      createdAt: this._props.createdAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get type(): TransactionType {
    return this._props.type;
  }

  get userId(): string {
    return this._props.userId;
  }

  get description(): string | undefined {
    return this._props.description;
  }

  get amount(): Amount {
    return this._props.amount;
  }

  get idempotencyKey(): string | undefined {
    return this._props.idempotencyKey;
  }

  get createdAt(): Date {
    return this._props.createdAt ?? new Date();
  }
}
