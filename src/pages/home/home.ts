import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { MapsfindPage } from '../mapsfind/mapsfind';
import { MapsProvider } from '../../providers/maps/maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  myLocation: any;
  terdekat: any = {};
  selected: any = null;
  platform: any;
  maps: any;
  searching: boolean = false;
  dataSearch: any = [];
  dataRs: any = [];

  constructor(public navCtrl: NavController, public alert: AlertController, public loaderCtrl: LoadingController, private geoLoc: Geolocation, private api: MapsProvider) {

    this.getDataRS();

  }

  initHere() {

    this.platform = new H.service.Platform({
      'app_id': this.api.app.id,
      'app_code': this.api.app.code
    });

    const defaultLayers = this.platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    this.maps = new H.Map(
      document.getElementById('mapshome'),
      defaultLayers.normal.map,
      {
        zoom: 14,
        center: this.myLocation,
      }
    );

    const mapEvents = new H.mapevents.MapEvents(this.maps);
    const behavior = new H.mapevents.Behavior(mapEvents);
    const ui = H.ui.UI.createDefault(this.maps, defaultLayers);
    const group = new H.map.Group();

    this.maps.addObject(group);

    this.dataRs.forEach((data: any) => {

      this.addMarkers({ lat: data.lat, lng: data.lng }, data, group);

    });

    group.addEventListener('tap', (evt) => {

      this.selected = evt.target.getData()

    }, false);

    // add marker my location
    this.addMarkers(this.myLocation, null, null, 'assets/icon/mypath.png');

  }

  addMarkers(kordinat: any, data: any = null, group: any = null, iconku: any = null){

    let path = (iconku) ? iconku : 'assets/icon/path.png';
    const icon = new H.map.Icon(path);
    const marker = new H.map.Marker(kordinat, { icon: icon });
    let maps = this.maps;

    if (group) {

      maps = group;

    }

    if (data) {

      marker.setData(data);

    }

    maps.addObject(marker);

  }

  getMatrixDistance() {

    let loaderku  = this.loaderCtrl.create({
      spinner : 'crescent',
      content : 'Mencari Distance...'
    });

    loaderku.present();

    let url: string = 'https://matrix.route.api.here.com/routing/7.2/calculatematrix.json';

    url += '?app_id=' + this.api.app.id + '&app_code=' + this.api.app.code;
    url += '&start0=' + this.myLocation.lat + ',' + this.myLocation.lng;

    this.dataRs.forEach((element, i) => {

      url += '&destination' + i + '=' + element.lat + ',' + element.lng;

    });

    url += '&summaryAttributes=distance'
    url += '&mode=fastest;car;traffic:disabled';
    // url += '&searchrange=5000'

    this.api.getData(url).subscribe((data: any) => {

      if (data.response) {

        let terdekat: number = Number.MAX_SAFE_INTEGER;
        let x: any = data.response.matrixEntry;

        x.forEach((a, i) => {

          let jarak = (a.summary.distance) ? a.summary.distance : Number.MAX_SAFE_INTEGER;

          this.dataRs[i].jarak = (a.summary.distance) ? a.summary.distance : Number.MAX_SAFE_INTEGER;
          this.dataRs[i].txtjarak = (a.summary.distance) ? String((a.summary.distance / 1000).toFixed(2)) + ' Km' : 'Tidak Terjangkau';

          if (jarak < terdekat) {

            this.terdekat = this.dataRs[i];
            terdekat = jarak;

          }

        });

      }

      loaderku.dismiss();

    }, (err) => {

      loaderku.dismiss();

      console.log('Error Get Matix : ', String(err));

    });

  }

  getDataRS() {

    const loaderku  = this.loaderCtrl.create({
      spinner : 'crescent',
      content : 'Mengambil Data...'
    });

    loaderku.present();

    this.api.getData('assets/json/data-rs.json').subscribe((data: any) => {

      this.dataRs = data;
      this.terdekat = data[0];

      loaderku.dismiss();

      this.getMyLocation();

    }, (err) => {

      loaderku.dismiss();

      console.log('Error get data RS', String(err));

    });

  }

  goToMaps(start: any, end: any) {

    this.navCtrl.push(MapsfindPage, { 'start' : start, 'end' : end });

  }

  getMyLocation() {

    let loaderku  = this.loaderCtrl.create({
      spinner : 'crescent',
      content : 'Mencari Lokasi Device...'
    });

    const alert = this.alert.create({
      title: 'Kesalahan Pengambilan Lokasi',
      message: 'Terjadi kesalahan saat mencari lokasi device'
    });

    loaderku.present();

    this.geoLoc.getCurrentPosition().then((resp) => {

      this.myLocation = {
        'lat' : resp.coords.latitude,
        'lng' : resp.coords.longitude,
      };

      this.initHere();

      setTimeout(() => {

        setTimeout(() => {

          this.getMatrixDistance();

        }, 100);

        loaderku.dismiss();

      }, 1000);

     }).catch((error) => {

      alert.present();
      loaderku.dismiss();

      console.log('Error getting location', (error).toString());

    });

  }

  searchRS(event: any) {

    // set val to the value of the searchbar
    const val = event.target.value;

    if (val && val.trim() != '') {

      this.dataSearch = this.dataRs.filter((item) => {

        return (item.nama.toLowerCase().indexOf(val.toLowerCase()) > -1);

      });

      this.searching = true;

    } else {

      this.dataSearch = [];
      this.searching = false;


    }

  }

  closeSelected() {

    this.selected = null;

  }

}
