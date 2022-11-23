import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable } from "rxjs";
import { Usuario } from "../model/usuario.model";
import { BaseService } from "../../services/base.service";

@Injectable()
export class ContaService extends BaseService {
  constructor (private http: HttpClient) { super() }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    let response = this.http.post(this.UrlServiceV1 + 'nova-conta', usuario, this.ObterHeaderJson())
    .pipe(
      map(this.extractData),
      catchError(this.serviceError)
    );
    return response;
  }
  //"id": "29d99023-d297-4c03-bea5-eaba12143bc8",

  login(usuario: Usuario): Observable<Usuario> {
    let response = this.http.post(this.UrlServiceV1 + 'entrar', usuario, this.ObterHeaderJson())
    .pipe(
      map(this.extractData),
      catchError(this.serviceError)
    );
    return response;
  }
}

