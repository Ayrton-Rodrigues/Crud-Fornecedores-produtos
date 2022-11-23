import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { ContaService } from '../../services/conta.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuario: any;

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private toastr: ToastrService,
    private router: Router
    ) { }
  loginForm!: FormGroup
  errors: any[] = [];
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]]
    })
  }

  login() {
    if(this.loginForm.dirty && this.loginForm.valid) {
    debugger
     this.usuario = Object.assign({}, this.usuario, this.loginForm.value);

     this.contaService.login(this.usuario).subscribe(

       success => {this.processarSucesso(success)},
       fail => {this.processarFalha(fail)}
     )
 }


}
processarSucesso(response: any) {

   this.loginForm.reset();
   this.errors = [];

   this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);
   const user = this.contaService.LocalStorage.obterUsuario();
   this.toastr.success('Login realizado com sucesso!', 'Bem vindo ' + user.email + ' :D', {
     timeOut: 10000
   })
   this.router.navigate(['/home']);
}

processarFalha(fail: any) {
this.errors = fail
this.toastr.error('Ocorreu um erro!', 'Opa :(')
}


}
