import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { LocalStorageUtils } from "src/app/utils/localstorage";

@Injectable()

export class BaseService {

  public LocalStorage = new LocalStorageUtils();
  protected UrlServiceV1: string = environment.apiUrlV1;

  protected ObterHeaderJson() {
      return {
        headers: {
          'Content-Type': 'application/json'
        }
      }
  }

  protected   ObterAuthHeaderJson() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.LocalStorage.obterTokenUsuario()
      }
    }
  }

  protected extractData(response: any) {
    return response.data || {};
  }

  protected serviceError(response: Response | any) {
    let errMsg: string[] = [];
    if (response instanceof HttpErrorResponse) {

      if(response.statusText === "Unknown Error") {
        errMsg.push("Ocorreu um erro desconhecido.");
        response.error.errors = errMsg;
      }

    }
    console.error(response);
    return throwError(() => response.error.errors);
  }
}
