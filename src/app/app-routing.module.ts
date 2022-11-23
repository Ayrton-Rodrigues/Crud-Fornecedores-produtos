import { ContaGuard } from './conta/services/conta.guard';
import { CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './navegacao/home/home.component';
import { NotFoundComponent } from './navegacao/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'conta', loadChildren: () => import('./conta/conta.module').then(m => m.ContaModule) },
  { path: 'fornecedores', loadChildren: () => import('../app/fornecedor/fornecedor.module').then(m => m.FornecedorModule) },
  { path: 'produtos', loadChildren: () => import('../app/produto/produto.module').then(m => m.ProdutoModule) },

  { path: 'acesso-negado', component: NotFoundComponent },
  { path: "**", component: NotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
