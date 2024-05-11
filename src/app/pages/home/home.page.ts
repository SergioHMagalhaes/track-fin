import { Component } from '@angular/core';
import { ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { TransferService } from "../../services/transfer/transfer.service";
import { ITransfer, Type } from 'src/app/models/transfer';
import { DbService, Models } from 'src/app/services/db/db.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements ViewDidEnter, ViewWillLeave {

  public type = Type;
  public isModalOpen = false;
  public transfers: ITransfer[] = [];

  private subscriptions: Array<Subscription | undefined> = [];

  constructor(
    private readonly db: DbService,
    private readonly transferService: TransferService
  ) { }

  public async ionViewDidEnter() {
    await this.transferService.setTransfers();
    this.transfers = await this.db.getAll(Models.transfer);
    this.getTransfers();
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

}
