import { Router } from '@angular/router';
import { ContaService } from './../../conta/services/conta.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
  selector: 'app-menu-login',
  templateUrl: './menu-login.component.html',
  styleUrls: ['./menu-login.component.scss']
})
export class MenuLoginComponent {

  constructor(private router: Router) { }
  token: string = "";
  user: any
  email: string = "";
  localStorage = new LocalStorageUtils();

  usuarioLogado(): boolean{

   this.token = this.localStorage.obterTokenUsuario();
   this.user = this.localStorage.obterUsuario();

   if(this.user){{
      this.email = this.user.email;
   }}

   return this.token !== null;

  }

  logout(){
    this.localStorage.limparDadosLocaisUsuario();
    location.reload();


  }

}
