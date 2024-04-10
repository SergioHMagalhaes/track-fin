import { Component } from '@angular/core';
import { TransferService } from "../../services/transfer/transfer.service";
import { Type } from 'src/app/models/transfer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  public type = {
    sent: Type.sent,
    received: Type.received
  }
  public isModalOpen = false;
  constructor(
    private readonly transferService: TransferService
  ) { }

  public showModal(isModalOpen: boolean, modalType: Type) {
    this.transferService.changeDisplay({ isModalOpen, modalType });
  }

}
