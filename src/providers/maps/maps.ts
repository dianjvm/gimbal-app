import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapsProvider {

  constructor(private http:HttpClient) {
    console.log('Hello MapsProvider Provider');
  }

  public app = {
    'id' : 'BiP0vAfUTUCuCObJWM85',
    'code' : 'QeOLp6UpXCrVoUJQRjha1w',
  };

  public getData(url: string) {

    return this.http.get(url);

  }

}
