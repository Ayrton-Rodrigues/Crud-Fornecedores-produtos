import { Component, OnInit, ViewChildren, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { CepConsulta } from '../models/endereco';
import { StringUtils } from 'src/app/utils/string-utils';
import { MASKS, NgBrazilValidators } from 'ng-brazil';



@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class NovoComponent implements OnInit {



  errors: any[] = [];
  fornecedorForm!: FormGroup;
  fornecedor: Fornecedor = new Fornecedor();
  tipoDocumento: string = '1';
  public MASKS = MASKS;

  textoDocumento: string = 'CPF (requerido)';
  formResult: string = '';

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService
    ) {}




  ngOnInit() {


    // for(const win in window){
    //   console.log(win);
    // }
    const arr = Array.from(window.document.querySelectorAll('input'))

    for(const win of arr){
      if(win.type == 'text'){
        console.log(win);
      }

    }


    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required, NgBrazilValidators.cpf]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required, NgBrazilValidators.cep]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
    });

    this.fornecedorForm.patchValue({ tipoFornecedor: '1', ativo: true });
  }
  tipoFornecedorForm(event: any) {
    this.tipoDocumento = event.srcElement.defaultValue;
    this.tipoDocumento === '1' ? this.textoDocumento = 'CPF (requerido)' : this.textoDocumento = 'CNPJ (requerido)';
    this.fornecedorForm.controls['documento'].setValidators([Validators.required, this.tipoDocumento === '1' ? NgBrazilValidators.cpf : NgBrazilValidators.cnpj]);
    this.fornecedorForm.controls['documento'].updateValueAndValidity();
  }

  buscarCep(event: any) {

    let cep = event.target.value;
    cep = StringUtils.somenteNumeros(cep);
    if (cep.length < 8) return;

    this.fornecedorService.consultarCep(cep)
      .subscribe(
        {
          next: (cepConsulta) => this.preencherEnderecoConsulta(cepConsulta),
          error: (erro) => this.errors.push(erro)
        }
        // cepRetorno => this.preencherEnderecoConsulta(cepRetorno),
        // erro => this.errors.push(erro)
        );
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta) {

    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: cepConsulta.logradouro,
        bairro: cepConsulta.bairro,
        cep: cepConsulta.cep,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf
      }
    });
  }

  adicionarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      this.formResult = JSON.stringify(this.fornecedor);
      console.log(this.formResult);

       this.fornecedor.endereco.cep = StringUtils.somenteNumeros(this.fornecedor.endereco.cep);
       this.fornecedor.documento = StringUtils.somenteNumeros(this.fornecedor.documento);
      // forçando o tipo fornecedor ser serializado como INT
      this.fornecedor.tipoFornecedor = parseInt(this.fornecedor.tipoFornecedor.toString());
      console.log(this.fornecedor);
      this.fornecedorService.novoFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );
    }
  }

  processarSucesso(response: any) {
    this.fornecedorForm.reset();
    this.errors = [];


    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
}


