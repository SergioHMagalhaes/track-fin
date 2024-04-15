export enum Type {
  sent = "sent",
  received = "received"
}

export interface ITransfer {
  id?: number;
  category: Type;
  description: string;
  amount: number;
  date: Date;
  type: Type;
}
