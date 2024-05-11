import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as dayjs from "dayjs";

import { TransferService } from "../../services/transfer/transfer.service";
import { Subscription } from 'rxjs';
import { ITransfer, Type } from 'src/app/models/transfer';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ICategory, CategoryName } from 'src/app/models/category';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnDestroy, OnInit {
  @ViewChild('currencyInput') currencyInput: ElementRef | undefined;

  public isModalOpen: boolean = false;
  public modalType: Type = Type.Inflows;
  public formOutflows: FormGroup;
  public formInflows: FormGroup;
  public value: number = 0;
  public type = Type;
  public editableEvent?: ITransfer;
  public categories: ICategory[] = [];

  private subscriptions: Array<Subscription | undefined> = [];

  constructor(
    private readonly categoryService: CategoryService,
    private readonly transferService: TransferService,
    private readonly formBuilder: FormBuilder,
    private readonly utils: UtilsService
  ) {
    this.formOutflows = this.formBuilder.group({
      id: null,
      amount: 0,
      description: [""],
      category: [null, Validators.required],
      date: [dayjs().format("YYYY-MM-DDTHH:mm:ssZ"), Validators.required],
      type: Type.Outflows
		});

    this.formInflows = this.formBuilder.group({
      id: null,
      amount: 0,
      description: [""],
      category: [null, Validators.required],
      date: [dayjs().format("YYYY-MM-DDTHH:mm:ssZ"), Validators.required],
      type: Type.Inflows
		});
  }

  public get filterCategories (): ICategory[] {
    return this.categories.filter(category => category.type === this.modalType);
  }

  ngOnInit (): void {
    this.categories = this.categoryService.categories;
		this.getDisplay();
    this.prepareForm();
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
    if (this.modalType === Type.Outflows)
      icon = this.formOutflows.get('category')?.value as ICategory;
    else
      icon = this.formInflows.get('category')?.value as ICategory;
    if (icon)
      return icon.icon;
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
    const form = this.modalType === Type.Outflows ? this.formOutflows.value : this.formInflows.value;
    form.categoryIcon = form.category.icon;
    form.categoryName = form.category.name;
    delete form.category;
    delete form.id;
    await this.transferService.addTransfer(form);

    await this.transferService.setTransfers();
    this.resetForm();
    this.setOpen(false);
  }

  public async update (): Promise<void> {
    const form = this.modalType === Type.Outflows ? this.formOutflows.value : this.formInflows.value;
    form.categoryIcon = form.category.icon;
    form.categoryName = form.category.name;
    delete form.category;
    await this.transferService.updateTransfer(form);

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

    const form = this.modalType === Type.Outflows ? this.formOutflows.value : this.formInflows.value;
    await this.transferService.removeTransfer(form.id);

    await this.transferService.setTransfers();
    this.resetForm();
    this.setOpen(false);
  }

  public disabledSaveButton (): boolean {
    const form = this.modalType === Type.Outflows ? this.formOutflows : this.formInflows;
    return form.invalid || form.get("amount")?.value <= 0;
  }

  private resetForm (): void {
    const form = this.modalType === Type.Outflows? this.formOutflows : this.formInflows;

    form.get("id")?.setValue(null);
    form.get("amount")?.setValue(0);
    form.get("description")?.setValue("");
    form.get("category")?.setValue(this.categoryService.getCategoryByName(CategoryName.Others, this.modalType));
    form.get("date")?.setValue(dayjs().format("YYYY-MM-DDTHH:mm:ssZ"));

  }

  private prepareForm (): void {
    const form = this.modalType === Type.Outflows ? this.formOutflows : this.formInflows;

    if (this.editableEvent) {
      form.get("id")?.setValue(this.editableEvent.id || null);
      form.get("amount")?.setValue(this.editableEvent.amount || 0);
      form.get("description")?.setValue(this.editableEvent.description || "");
      form.get("category")?.setValue(this.categoryService.getCategoryByName(this.editableEvent.categoryName, this.modalType) || this.categoryService.getCategoryByName(CategoryName.Others, this.modalType));
      form.get("date")?.setValue(this.editableEvent.date || dayjs().format("YYYY-MM-DDTHH:mm:ssZ"));
    } else {
      form.get("category")?.setValue(this.categoryService.getCategoryByName(CategoryName.Others, this.modalType));
    }
  }
}
