import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private geo: Geolocation) {

  	setTimeout(() => {

  		this.getLocations();

  	}, 1000);

  }

  getLocations() {
  	this.geo.getCurrentPosition().then((resp) => {
	 // resp.coords.latitude
	 // resp.coords.longitude
	 
	 this.alertCtrl.create({
	 	title: 'My GPS',
	 	message: 'lat : ' + resp.coords.latitude + ', Lng: ' + resp.coords.longitude,
	 	enableBackdropDismiss : true
	 }).present();

	}).catch((error) => {
	 
	  console.log('Error getting location', error);
	
	});
  }

}
