import { RouterStateSnapshot } from '@angular/router';
import { LocalStorageUtils } from 'src/app/utils/localstorage';
import { Router, ActivatedRoute } from '@angular/router';

import {  HttpEvent, HttpHandler,  HttpInterceptor,  HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandlerService implements HttpInterceptor {

  constructor(
    private router: Router,
  
    ) { }

  localStorageUtils = new LocalStorageUtils();

  intercept( req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError( error => {

        if(error instanceof HttpErrorResponse) {

          if(error.status === 401) {
            this.localStorageUtils.limparDadosLocaisUsuario();
            this.router.navigate(['conta/login'], { queryParams: { returnUrl: this.router.url }});
          }

          if(error.status === 403) {
            this.router.navigate(['/acesso-negado']);

          }
        }
        return throwError(() => error);
      }
    ));
  }
}
