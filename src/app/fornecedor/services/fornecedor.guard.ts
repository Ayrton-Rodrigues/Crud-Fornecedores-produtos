import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, CanDeactivate } from '@angular/router';
import { NovoComponent } from '../novo/novo.component';
import { BaseGuard } from 'src/app/fornecedor/services/base.guard';

@Injectable()
export class FornececedorGuard extends BaseGuard implements CanActivate, CanDeactivate<NovoComponent> {

    constructor(protected override router: Router) { super(router); }



    canDeactivate(component: NovoComponent) {
        if(component.fornecedorForm.dirty) {
            return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulário?');
        }
        return true
    }

    canActivate(routeAc: ActivatedRouteSnapshot) {

        return super.validarClaims(routeAc);
    }


}
