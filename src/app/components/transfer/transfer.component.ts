import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from "dayjs";

import { TransferService } from "../../services/transfer/transfer.service";
import { Subscription } from 'rxjs';
import { Type } from 'src/app/models/transfer';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnDestroy, OnInit {

  @ViewChild('currencyInput') currencyInput: ElementRef | undefined;
  public isModalOpen: boolean = false;
  public modalType: Type = Type.sent;
  public formSent: FormGroup;
  public formReceived: FormGroup;
  public value: number = 0;
  public type = {
    sent: Type.sent,
    received: Type.received
  }
  private subscriptions: Array<Subscription | undefined> = [];

  constructor(
    private readonly transferService: TransferService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.formSent = this.formBuilder.group({
      value: 0,
      description: ["", Validators.required],
      category: ["", Validators.required],
      date: [dayjs().format("YYYY-MM-DDTHH:mm:ssZ"), Validators.required],
		});

    this.formReceived = this.formBuilder.group({
      value: 0,
      description: ["", Validators.required],
      category: ["", Validators.required],
      date: [dayjs().format("YYYY-MM-DDTHH:mm:ssZ"), Validators.required],
		});
  }

  ngOnInit (): void {
		this.getDisplay();
	}

	ngOnDestroy (): void {
		for (const subscription of this.subscriptions)
			subscription?.unsubscribe();
	}

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  moveCursorToEnd() {
    if (!this.currencyInput) return;
    const input: HTMLInputElement = this.currencyInput.nativeElement;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  public selectedIcon () {
    let icon
    if (this.modalType === Type.sent)
      icon = this.formSent.get('category')?.value as string;
    else
      icon = this.formReceived.get('category')?.value as string;
    if (icon)
      return icon;
    else
      return 'list';
  }

  public getDisplay (): void {
		this.subscriptions.push(
			this.transferService
				.getShow()
				.subscribe( async show => {
          this.isModalOpen = show.isModalOpen
          this.modalType = show.modalType;
        })
		);
	}
}
