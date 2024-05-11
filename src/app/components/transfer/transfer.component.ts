import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from "dayjs";

import { TransferService } from "../../services/transfer/transfer.service";
import { Subscription } from 'rxjs';
import { ITransfer, Type } from 'src/app/models/transfer';
import { DbService, Models } from 'src/app/services/db/db.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

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
  public type = Type;
  public editableEvent?: ITransfer;

  private subscriptions: Array<Subscription | undefined> = [];

  constructor(
    private readonly transferService: TransferService,
    private readonly formBuilder: FormBuilder,
    private readonly dbService: DbService,
    private readonly utils: UtilsService
  ) {
    this.formSent = this.formBuilder.group({
      id: null,
      amount: 0,
      description: ["", Validators.required],
      category: ["", Validators.required],
      date: [dayjs().format("YYYY-MM-DDTHH:mm:ssZ"), Validators.required],
      type: Type.sent
		});

    this.formReceived = this.formBuilder.group({
      id: null,
      amount: 0,
      description: ["", Validators.required],
      category: ["", Validators.required],
      date: [dayjs().format("YYYY-MM-DDTHH:mm:ssZ"), Validators.required],
      type: Type.received
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
          this.editableEvent = show.editableEvent;
          this.prepareForm();
        })
		);
	}

  public async save (): Promise<void> {
    const form = this.modalType === Type.sent ? this.formSent.value : this.formReceived.value;
    delete form.id;
    await this.dbService.save(Models.transfer, form);

    await this.transferService.setTransfers();
    this.resetForm();
    this.setOpen(false);
  }

  public async update (): Promise<void> {
    const form = this.modalType === Type.sent ? this.formSent.value : this.formReceived.value;
    await this.dbService.update(Models.transfer, form);

    await this.transferService.setTransfers();
    this.resetForm();
    this.setOpen(false);
  }

  public async remove (): Promise<void> {
    const confirm = await this.utils.prompt(
			"Confirmação",
			"Tem certeza de que deseja excluir esta transação? Esta ação não pode ser desfeita.",
		);

    if (!confirm) return;

    const form = this.modalType === Type.sent ? this.formSent.value : this.formReceived.value;
    await this.dbService.remove(Models.transfer, form.id);

    await this.transferService.setTransfers();
    this.resetForm();
    this.setOpen(false);
  }

  private resetForm (): void {
    const form = this.modalType === Type.sent ? this.formSent : this.formReceived;

    form.get("id")?.setValue(null);
    form.get("amount")?.setValue(0);
    form.get("description")?.setValue("");
    form.get("category")?.setValue("");
    form.get("date")?.setValue(dayjs().format("YYYY-MM-DDTHH:mm:ssZ"));

  }

  private prepareForm (): void {
    if (this.editableEvent) {
      const form = this.modalType === Type.sent ? this.formSent : this.formReceived;

      form.get("id")?.setValue(this.editableEvent.id || null);
      form.get("amount")?.setValue(this.editableEvent.amount || 0);
      form.get("description")?.setValue(this.editableEvent.description || "");
      form.get("category")?.setValue(this.editableEvent.category || "");
      form.get("date")?.setValue(this.editableEvent.date || dayjs().format("YYYY-MM-DDTHH:mm:ssZ"));
    }
  }
}
