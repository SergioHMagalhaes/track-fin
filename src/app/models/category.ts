import { Type } from "./transfer";

export interface ICategory {
  type: Type;
  name: CategoryName;
  icon: string;
}

export enum CategoryName {
  Food = 'Alimentação',
  Leisure = 'Lazer',
  Transport = 'Transporte',
  Education = 'Educação',
  Health = 'Saúde',
  Others = 'Outros',
  Salary = 'Salário',
  Investments = 'Investimentos'
}
