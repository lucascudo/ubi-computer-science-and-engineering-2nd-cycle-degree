import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, shareReplay } from "rxjs";
import { tap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { IUser } from "../models/user.model";
import { JwtHelperService } from "@auth0/angular-jwt";
import { KeyExchangeService } from "./key-exchange.service";


@Injectable()
export class AuthService {

  constructor(private http: HttpClient, private keyExchangeService: KeyExchangeService) {}

  private setSession(authResult: any, keyExchangeService: KeyExchangeService): void {
    const access_token = JSON.parse(
      keyExchangeService.decryptMessage(
        Uint8Array.from(authResult.oneTimeCode),
        Uint8Array.from(authResult.cipherText),
      ),
    ).access_token;
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(access_token);
    const expiresAt = moment().add(decodedToken.exp,'second');

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('decoded_token', JSON.stringify(decodedToken));
    localStorage.setItem('exp', JSON.stringify(expiresAt.valueOf()) );
  }

  getdecodedToken() {
    const decodedToken = localStorage.getItem('decoded_token');
    return decodedToken ? JSON.parse(decodedToken) : undefined;
  }

  login(username:string, password:string ): Observable<IUser>  {
    const message = this.keyExchangeService.encryptPlainText(JSON.stringify({
      username,
      password,
    }));
    return this.http.post<IUser>(environment.api + 'login', message)
      .pipe(tap((res) => this.setSession(res, this.keyExchangeService)))
      .pipe(shareReplay());
  }

  register(username:string, password:string ): Observable<any>  {
    const message = this.keyExchangeService.encryptPlainText(JSON.stringify({
      username,
      password,
    }));
    return this.http.post(environment.api + 'register', message);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('decoded_token');
    localStorage.removeItem('exp');
  }

  isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }

  getExpiration(): moment.Moment {
    const expiration: any = localStorage.getItem('exp');
    const expiresAt: any = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getProfile() {
    return this.http.get(environment.api + 'profile/' + JSON.stringify(Array.from(this.keyExchangeService.getPublicKey())));
  }
}
