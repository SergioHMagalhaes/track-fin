import { Component } from '@angular/core';
import { ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { TransferService } from "../../services/transfer/transfer.service";
import { ITransfer, Type } from 'src/app/models/transfer';
import { AccountService } from 'src/app/services/account/account.service';

import { IAccount } from 'src/app/models/account';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements ViewDidEnter, ViewWillLeave {

  public account: IAccount | null = null;
  public type = Type;
  public isModalOpen = false;
  public transfers: ITransfer[] = [];

  private subscriptions: Array<Subscription | undefined> = [];

  constructor(
    private readonly accountService: AccountService,
    private readonly transferService: TransferService
  ) { }

  public async ionViewDidEnter() {
    await this.transferService.setTransfers();
    this.transfers = this.transferService.transfers;
    await this.accountService.setAccount();
    this.account = this.accountService.account;

    this.getTransfers();
    this.getAccount();
  }

  public ionViewWillLeave (): void {
		for (const subscription of this.subscriptions)
			subscription?.unsubscribe();
	}

  public showModal(isModalOpen: boolean, modalType: Type, editableEvent?: ITransfer) {
    this.transferService.changeDisplay({ isModalOpen, modalType, editableEvent });
  }

  public getTransfers (): void {
		this.subscriptions.push(
			this.transferService
				.getTransfersObservable()
				.subscribe(
					transfers => (this.transfers = transfers)
				)
		);
	}

  public getAccount (): void {
		this.subscriptions.push(
			this.accountService
				.getAccountObservable()
				.subscribe(
					account => (this.account = account)
				)
		);
	}

}
