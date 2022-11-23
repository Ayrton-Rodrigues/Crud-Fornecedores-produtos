import { LocalStorageUtils } from 'src/app/utils/localstorage';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CadastroComponent } from "../components/cadastro/cadastro.component";

@Injectable()

export class ContaGuard implements CanDeactivate<CadastroComponent>, CanActivate{
    constructor (private router: Router) {}
    localStorage = new LocalStorageUtils();

    canActivate(): boolean {
      const user = this.localStorage.obterUsuario();
      if(user){
        alert(`Perdão ${user.email}, você já está logado no sistema!`);
        this.router.navigate(['home']);
      }
      return true;
    }


    canDeactivate(component: CadastroComponent): boolean {
        if(component.cadastroForm.dirty){
            return window.confirm('Tem certeza que deseja sair dessa página?');
        }
        return true;
    }

}
