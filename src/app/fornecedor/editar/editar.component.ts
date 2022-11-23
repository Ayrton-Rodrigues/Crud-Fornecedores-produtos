import { CustomValidators } from 'ng2-validation';
import { Endereco } from './../models/endereco';
import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { StringUtils } from 'src/app/utils/string-utils';
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';
import { MASKS, NgBrazilValidators } from 'ng-brazil';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['../../../../node_modules/ngx-spinner/animations/pacman.css'],
})
export class EditarComponent implements OnInit {
  errors: any[] = [];
  errorsEndereco: any[] = [];
  fornecedorForm!: FormGroup;
  enderecoForm!: FormGroup;

  fornecedor: Fornecedor = new Fornecedor();
  endereco: Endereco = new Endereco();

  textoDocumento: string = '';
  tipoFornecedor!: number;

  tipoDocumento: string = '1';
  public MASKS = MASKS;

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.tipoFornecedor = this.fornecedor.tipoFornecedor;
  }

  ngOnInit() {
    this.spinner.show();

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required, NgBrazilValidators.cpf]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
    });

    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required, NgBrazilValidators.cep]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: '',
    });

    this.fornecedorForm.patchValue({ tipoFornecedor: '1', ativo: true });
    this.preencherForm();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  preencherForm() {
    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor.tipoFornecedor.toString(),
      documento: this.fornecedor.documento,
    });

    if (this.tipoDocumento === '1') {
      this.textoDocumento = 'CPF (requerido)';
      this.fornecedorForm.controls['documento'].setValidators([
        Validators.required,
        NgBrazilValidators.cpf,
      ]);
    } else {
      this.textoDocumento = 'CNPJ (requerido)';
      this.fornecedorForm.controls['documento'].setValidators([
        Validators.required,
        NgBrazilValidators.cnpj,
      ]);
    }

    this.enderecoForm.patchValue({
      id: this.fornecedor.endereco?.id,
      logradouro: this.fornecedor.endereco?.logradouro,
      numero: this.fornecedor.endereco?.numero,
      complemento: this.fornecedor.endereco?.complemento,
      bairro: this.fornecedor.endereco?.bairro,
      cep: this.fornecedor.endereco?.cep,
      cidade: this.fornecedor.endereco?.cidade,
      estado: this.fornecedor.endereco?.estado,
    });
  }

  tipoFornecedorForm(event: any) {
    this.tipoDocumento = event.srcElement.defaultValue;
    this.tipoDocumento === '1'
      ? (this.textoDocumento = 'CPF (requerido)')
      : (this.textoDocumento = 'CNPJ (requerido)');
    this.fornecedorForm.controls['documento'].setValidators([
      Validators.required,
      this.tipoDocumento === '1'
        ? NgBrazilValidators.cpf
        : NgBrazilValidators.cnpj,
    ]);
    this.fornecedorForm.controls['documento'].updateValueAndValidity();
  }

  buscarCep(cep: any) {
    let cepEvent = cep.target.value;
    cepEvent = StringUtils.somenteNumeros(cepEvent);
    if (cepEvent.length < 8) return;

    this.fornecedorService.consultarCep(cepEvent).subscribe({
      next: (cepRetorno) => this.preencherEnderecoConsulta(cepRetorno),
      error: (erro) => this.errors.push(erro),
    });
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta) {
    this.enderecoForm.patchValue({
      logradouro: cepConsulta.logradouro,
      bairro: cepConsulta.bairro,
      cep: cepConsulta.cep,
      cidade: cepConsulta.localidade,
      estado: cepConsulta.uf,
    });
  }

  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value  );
      this.fornecedor.documento = StringUtils.somenteNumeros( this.fornecedor.documento );

      /* Workaround para evitar cast de string para int no back-end */
      this.fornecedor.tipoFornecedor = parseInt( this.fornecedor.tipoFornecedor.toString() );

      this.fornecedorService.atualizarFornecedor(this.fornecedor).subscribe({
        next: (sucesso) => {
          this.processarSucesso(sucesso);
        },
        error: (falha) => {
          this.processarFalha(falha);
        },
      });
    }
  }

  processarSucesso(response: any) {
    this.errors = [];

    let toast = this.toastr.success(
      'Fornecedor atualizado com sucesso!',
      'Sucesso!'
    );
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {
      this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);

      this.endereco.cep = StringUtils.somenteNumeros(this.endereco.cep);
   
      this.endereco.fornecedorId = this.fornecedor.id;

      this.fornecedorService.atualizarEndereco(this.endereco).subscribe({
        next: () => this.processarSucessoEndereco(this.endereco),
        error: (falha) => {
          this.processarFalhaEndereco(falha);
        },
      });
    }
  }

  processarSucessoEndereco(endereco: Endereco) {
    this.errors = [];

    this.toastr.success('Endereço atualizado com sucesso!', 'Sucesso!');
    this.fornecedor.endereco = endereco;
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(fail: any) {
    this.errorsEndereco = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  abrirModal(content: any) {
    this.modalService.open(content);
  }
}
