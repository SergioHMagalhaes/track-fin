export enum Type {
  Outflows = "outflows",
  Inflows = "inflows"
}

export interface ITransfer {
  id?: number;
  category: Type;
  description: string;
  amount: number;
  date: Date;
  type: Type;
}
