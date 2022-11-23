import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ContaAppComponent } from './conta.app.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { ContaGuard } from './services/conta.guard';
const contaRouterConfig: Routes = [
  {
    path: '',
    component: ContaAppComponent,
    children: [
      {  path: 'login', component: LoginComponent, canActivate: [ContaGuard] },
      {  path: 'cadastro', component: CadastroComponent, canDeactivate: [ContaGuard], canActivate: [ContaGuard] }
    ]
  }
]

@NgModule({
    imports: [RouterModule.forChild(contaRouterConfig) ],
    exports: [RouterModule]
})

export class ContaRoutingModule {}
