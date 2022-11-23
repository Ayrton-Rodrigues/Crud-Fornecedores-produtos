import { ProdutoModule } from './produto/produto.module';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContaModule } from './conta/conta.module';
import { NavegacaoModule } from './navegacao/navegacao.module';
import { ToastrModule } from 'ngx-toastr';
import { ErrorHandlerService } from './services/error.handler.service';

export const httpInterceptorError = {
  provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerService, multi: true
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavegacaoModule,
    NgbModule,
    ContaModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    ProdutoModule
  ],
  providers: [
    BaseService,
    httpInterceptorError

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
