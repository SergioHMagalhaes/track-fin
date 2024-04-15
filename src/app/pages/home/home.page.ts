import { Component, OnInit } from '@angular/core';
import { TransferService } from "../../services/transfer/transfer.service";
import { ITransfer, Type } from 'src/app/models/transfer';
import { DbService, Models } from 'src/app/services/db/db.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  public type = {
    sent: Type.sent,
    received: Type.received
  }
  public isModalOpen = false;
  public transfers: ITransfer[] = [];

  constructor(
    private readonly db: DbService,
    private readonly transferService: TransferService
  ) { }

  async ngOnInit() {
    this.transfers = await this.db.getAll(Models.transfer);
  }

  public showModal(isModalOpen: boolean, modalType: Type) {
    this.transferService.changeDisplay({ isModalOpen, modalType });
  }

}
