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
}
