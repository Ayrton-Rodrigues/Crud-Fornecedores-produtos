import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private baseService: BaseService) { }

  localStorage = new LocalStorageUtils();

  user: any = this.localStorage.obterUsuario();
  ngOnInit(): void {
    if(this.user){
      console.log(this.user.email);
    }
  }


}
