import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Type } from 'src/app/models/transfer';

interface IShow {
  isModalOpen: boolean;
  modalType: Type
}

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private show = new BehaviorSubject<IShow>({ isModalOpen: false, modalType: Type.sent });

  constructor() { }

  public getShow (): Observable<IShow> {
		return this.show.asObservable();
	}

  public changeDisplay (show: IShow): void {
		this.show.next(show);
	}
}
