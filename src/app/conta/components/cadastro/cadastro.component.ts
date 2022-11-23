import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../../environments/environment';

import { ContaService } from './../../services/conta.service';
import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../model/usuario.model';
import { CustomValidators } from 'ng2-validation';
import { fromEvent, merge, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit{

  constructor(
    private fb: FormBuilder,
    private contaService: ContaService,
    private route: Router,
    private toastr: ToastrService) { }



    errors: any[] = [];
    quantidade!: number;
    cadastroForm!: FormGroup;
    usuario!: Usuario;

    ngOnInit(): void {
      let senha = this.fb.control('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
      let confirmarSenha = this.fb.control('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(senha)]);
      this.cadastroForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: senha,
        confirmPassword: confirmarSenha
      })

      console.log(this.toastr)
    }


    adicionarConta() {
       if(this.cadastroForm.dirty && this.cadastroForm.valid) {
        this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);

        this.contaService.registrarUsuario(this.usuario).subscribe(
          success => {this.processarSucesso(success)},
          fail => {this.processarFalha(fail)}
        )
    }


  }
  processarSucesso(response: any) {

      this.cadastroForm.reset();
      this.errors = [];

      this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);

      this.toastr.success('Cadastro realizado com sucesso!', 'Bem vindo :D', {
        timeOut: 10000
      })
      this.route.navigate(['/home']);
  }

  processarFalha(fail: any) {
  this.errors = fail
  this.toastr.error('Ocorreu um erro!', 'Opa :(')
  }

}
