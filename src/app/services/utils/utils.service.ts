import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private readonly alertController: AlertController,
  ) { }

  public prompt (title: string, msg: string, cancelBtn: string = "Cancelar"): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			(await this.alertController.create({
				header: title,
				message: msg,
				backdropDismiss: false,
				buttons: [{
					text: cancelBtn,
					role: "cancel",
					handler: _ => {
						resolve(false);
					}
				}, {
					text: "Sim",
					role: "confirm",
					handler: _ => {
						resolve(true);
					}
				}]
			})).present();
		});
	}

  public getMonthName (month: number): string {
    switch (month) {
      case 0: return 'Janeiro';
      case 1: return 'Fevereiro';
      case 2: return 'Março';
      case 3: return 'Abril';
      case 4: return 'Maio';
      case 5: return 'Junho';
      case 6: return 'Julho';
      case 7: return 'Agosto';
      case 8: return 'Setembro';
      case 9: return 'Outubro';
      case 10: return 'Novembro';
      case 11: return 'Dezembro';
      default: return '';
    }
  }

  public getMonthNumber (month: string): number {
    switch (month) {
      case 'Janeiro': return 0;
      case 'Fevereiro': return 1;
      case 'Março': return 2;
      case 'Abril': return 3;
      case 'Maio': return 4;
      case 'Junho': return 5;
      case 'Julho': return 6;
      case 'Agosto': return 7;
      case 'Setembro': return 8;
      case 'Outubro': return 9;
      case 'Novembro': return 10;
      case 'Dezembro': return 11;
      default: return 0;
    }
  }
}
