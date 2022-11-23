import { Component, OnInit } from '@angular/core';
import { LocalStorageUtils } from 'src/app/utils/localstorage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }
  localStorage = new LocalStorageUtils();
  user: any = this.localStorage.obterUsuario();
  ngOnInit(): void {
    if(this.user){
      console.log(this.user.email);
    }
  }

  isCollapsed = true;

}
