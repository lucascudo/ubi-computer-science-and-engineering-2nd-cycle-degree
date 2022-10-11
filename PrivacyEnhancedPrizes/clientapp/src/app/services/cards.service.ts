import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeyExchangeService } from "./key-exchange.service";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class CardsService {

  constructor(private http: HttpClient, private keyExchangeService: KeyExchangeService) {}

  scratch(): Observable<any> {
    return this.http.get(environment.api + 'scratch-card/' + JSON.stringify(Array.from(this.keyExchangeService.getPublicKey())));
  }
}
