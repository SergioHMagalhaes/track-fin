export enum Type {
  Outflows = "outflows",
  Inflows = "inflows"
}

export interface ITransfer {
  id?: number;
  categoryIcon: string;
  categoryName: string;
  description: string;
  amount: number;
  date: Date;
  type: Type;
}
