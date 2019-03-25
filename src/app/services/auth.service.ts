import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = environment.token_storage_key;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.token_url;
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private plt: Platform,
    private alertController: AlertController
  ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  register(credentials) {
    return this.http.post(`${this.url}/api/register`, credentials).pipe(
        catchError(e => {
          this.showAlert('Your device will explode is 3..2..');
          throw new Error(e.error.msg);
        })
    );
  }

  login(credentials) {
    const endpoint = '/api/login';
    const url = this.url + endpoint;
    return this.http.post(url, credentials)
        .pipe(
            tap((res: any) => {
              this.storage.set(TOKEN_KEY, res.data.token);
              this.user = this.helper.decodeToken(res.data.token);
              this.authenticationState.next(true);
            }),
            catchError(e => {
              this.showAlert('Your device will explode is 3..2..');
               throw new Error(e.error.message);
            })
        );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  showAlert(msg) {
    const alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
}
