import { Component, OnInit } from '@angular/core';
import { IAccount } from 'src/app/models/account';
import { AccountService } from 'src/app/services/account/account.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  public appVersion = environment.version;
  public isModalOpen: boolean = false;
  public account?: IAccount | null = null;
  public accountName: string = '';

  constructor(
    private readonly accountService: AccountService,
  ) {}

  async ngOnInit() {
    await this.accountService.setAccount();
    this.account = this.accountService.account;
    this.accountName = this.account?.name || '';
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  public save () {
    if (!this.account) return;
    this.account.name = this.accountName;
    this.accountService.saveAccount(this.account);
    this.isModalOpen = false;
  }

}

