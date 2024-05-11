import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ITransfer, Type } from 'src/app/models/transfer';
import { DbService, Models } from '../db/db.service';
import { AccountService } from '../account/account.service';

interface IShow {
  isModalOpen: boolean;
  modalType: Type;
  editableEvent?: ITransfer;
}

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private show = new BehaviorSubject<IShow>({ isModalOpen: false, modalType: Type.sent });
  private _transfers: ITransfer[] = [];
  private transfersObservable = new BehaviorSubject<ITransfer[]>([]);

  constructor(
    private readonly db: DbService,
    private readonly accountService: AccountService
  ) { }

  public get transfers (): ITransfer[] {
		return this._transfers;
	}

  public getTransfersObservable (): BehaviorSubject<ITransfer[]> {
		return this.transfersObservable;
	}

  public async setTransfers (value?: ITransfer[]) {
		let transfers;
		if (value)
			transfers = value;
		else
    transfers = await this.db.transfer.toArray();

		if (transfers) {
			this._transfers = transfers;
			this.transfersObservable.next(transfers);
		}
		else {
			this._transfers = [];
			this.transfersObservable.next([]);
		}
	}

  public async addTransfer (transfer: ITransfer): Promise<void> {
    const account = await this.db.account.get(1);
    if (!account) return;

    if (transfer.type === Type.sent)
      account.amount -= transfer.amount;
    else
      account.amount += transfer.amount;

    await this.db.transfer.add(transfer);
    await this.db.account.put(account);
    await this.accountService.setAccount();
  }

  public async updateTransfer (transfer: ITransfer): Promise<void> {
    if (!transfer.id) return;
    await this.db.transfer.update(transfer.id, transfer);
    await this.accountService.calculateAmount();
  }

  public async removeTransfer (id: number): Promise<void> {
    await this.db.transfer.delete(id);
    await this.accountService.calculateAmount();
  }

  public getShow (): Observable<IShow> {
		return this.show.asObservable();
	}

  public changeDisplay (show: IShow): void {
		this.show.next(show);
	}
}
