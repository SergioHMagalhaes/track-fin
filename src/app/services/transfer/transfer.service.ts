import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { ITransfer, Type } from 'src/app/models/transfer';
import { DbService, Models } from '../db/db.service';

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
  ) { }

  public get transfers (): ITransfer[] | null {
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
    transfers = await this.db.getAll(Models.transfer);

		if (transfers) {
			this._transfers = transfers;
			this.transfersObservable.next(transfers);
		}
		else {
			this._transfers = [];
			this.transfersObservable.next([]);
		}
	}

  public getShow (): Observable<IShow> {
		return this.show.asObservable();
	}

  public changeDisplay (show: IShow): void {
		this.show.next(show);
	}
}
