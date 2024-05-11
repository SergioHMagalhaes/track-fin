import { Component, OnInit } from '@angular/core';
import { DbService } from './services/db/db.service';
import { IAccount } from './models/account';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private readonly db: DbService,
  ) {}

  public async ngOnInit() {
    const currentAccount = await this.db.account.get(1);

    if (!currentAccount) {
      const account: IAccount = {
        id: 1,
        name: 'User Account',
        amount: 0
      };

      await this.db.account.put(account);
    }

  }
}
