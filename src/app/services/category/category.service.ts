import { Injectable } from '@angular/core';
import { ICategory, CategoryName } from 'src/app/models/category';
import { Type } from 'src/app/models/transfer';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private _categories: ICategory[] = [
    { type: Type.Outflows, name: CategoryName.Food, icon: 'restaurant' },
    { type: Type.Outflows, name: CategoryName.Leisure, icon: 'game-controller' },
    { type: Type.Outflows, name: CategoryName.Transport, icon: 'car' },
    { type: Type.Outflows, name: CategoryName.Education, icon: 'school' },
    { type: Type.Outflows, name: CategoryName.Health, icon: 'medkit' },
    { type: Type.Outflows, name: CategoryName.Others, icon: 'list' },
    { type: Type.Inflows, name: CategoryName.Salary, icon: 'cash' },
    { type: Type.Inflows, name: CategoryName.Investments, icon: 'trending-up' },
    { type: Type.Inflows, name: CategoryName.Others, icon: 'list' },
  ]

  constructor() { }

  public get categories (): ICategory[] {
    return this._categories;
  }

  public get categoriesOutflows (): ICategory[] {
    return this._categories.filter(category => category.type === Type.Outflows);
  }

  public getCategoryByName (name: string, type: Type ): ICategory | undefined {
    return this._categories.find(category => category.name === name && category.type === type);
  }
}
