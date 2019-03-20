import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { Geolocation } from '@ionic-native/geolocation';

import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
/**
 * Generated class for the MapsfindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mapsfind',
  templateUrl: 'mapsfind.html',
})
export class MapsfindPage {

  rsData: any;
  platform: any;
  maps: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, private launchNavigator: LaunchNavigator, private api: MapsProvider, private geolocation: Geolocation) {

    this.rsData = this.navParams.data;

  }

  ionViewDidLoad() {

    setTimeout(() => {

      this.loadMaps();

    }, 200);

  }

  runNavigator() {

    let options: LaunchNavigatorOptions = {
      start: this.rsData.start.lat + ',' + this.rsData.start.lng
      // app: LaunchNavigator.APP.GOOGLE_MAPS
    };

    this.launchNavigator.navigate(this.rsData.end.lat + ',' + this.rsData.end.lng, options)
      .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );

  }

  loadMaps() {

    let loadku = this.loadCtrl.create({
      spinner: 'crescent',
      enableBackdropDismiss: false,
      dismissOnPageChange: true,
      content: 'Membuat Rute...'
    });

    loadku.present();

    this.platform = new H.service.Platform({
      'app_id': this.api.app.id,
      'app_code': this.api.app.code
    });

    const platform = this.platform;

    let lokasi:any = { lat: this.rsData.start.lat ? this.rsData.start.lat : -7.4353068, lng: this.rsData.start.lng ? this.rsData.start.lng : 109.2471289 }

    let defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    this.maps = new H.Map(
      document.getElementById('map'),
      defaultLayers.normal.map,
      {
        zoom: 15,
        center: lokasi
      });

    // Add map events functionality to the map

    // Create the default UI:
    H.ui.UI.createDefault(this.maps, defaultLayers, 'en-US');

    // // buat marker tujuanmu
    let icon1 = new H.map.Icon('assets/icon/path.png'),
    coords1 = { lat: this.rsData.end.lat, lng: this.rsData.end.lng },
    marker1 = new H.map.Marker(coords1, {icon: icon1});

    this.maps.addObject(marker1);

    let icon2 = new H.map.Icon('assets/icon/mypath.png'),
    coords2 = { lat: this.rsData.start.lat, lng: this.rsData.start.lng },
    marker2 = new H.map.Marker(coords2, {icon: icon2});

    this.maps.addObject(marker2);

    let mapEvents = new H.mapevents.MapEvents(this.maps);
    new H.mapevents.Behavior(mapEvents);

    let router = this.platform.getRoutingService(),
    routeRequestParams = {
      mode: 'shortest;pedestrian',
      representation: 'display', // Tate Modern
      routeattributes: 'shape',
      maneuverattributes: 'direction,action',
      waypoint0: String(this.rsData.start.lat) + ',' + String(this.rsData.start.lng),
      waypoint1: String(this.rsData.end.lat) + ',' + String(this.rsData.end.lng),
    };

    router.calculateRoute(
      routeRequestParams,
      (result) => {
        let route = result.response.route[0];
       /*
        * The styling of the route response on the map is entirely under the developer's control.
        * A representitive styling can be found the full JS + HTML code of this example
        * in the functions below:
        */
        let lineString = new H.geo.LineString(),
          routeShape = route.shape,
          polyline;

        routeShape.forEach(function(point) {
          let parts = point.split(',');
          lineString.pushLatLngAlt(parts[0], parts[1]);
        });

        polyline = new H.map.Polyline(lineString, {
          style: {
            lineWidth: 5,
            strokeColor: '#cf2250'
          }
        });
        // Add the polyline to the map
        this.maps.addObject(polyline);
        // And zoom to its bounding rectangle
        this.maps.setViewBounds(polyline.getBounds(), true);
        // ... etc.
      },
      (error) => {
        console.log('Error apaan nih ?',error);
      }
    );

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      if (data) {

        marker2.setPosition( { lat:data.coords.latitude, lng:data.coords.longitude } );

      }

    });

    loadku.dismiss();

  }

}
