import { Component, inject, OnInit, signal } from '@angular/core';
import { MainComponent } from './administrator/main-component/main-component';
import { Service } from './service/service';
import { usersInterface } from './interface/interface';
import { CashierMain } from './cashier/cashier-main/cashier-main';

@Component({
  selector: 'app-root',
  imports: [MainComponent, CashierMain],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  public service = inject(Service);
  users = signal<usersInterface[]>([]);
  errorLogin = signal(false);
  time : Date = new Date();
    
  ngOnInit(): void {
    this.service.getUsers().subscribe(data => {
      this.users.set(data);
    });
  }

  clickBtn(username: HTMLInputElement, password: HTMLInputElement){

    const user = (this.users().find(user => user.username === username.value && user.password === password.value));
    
    if(user){
      this.service.loggedUser = user;
      this.service.validLogin.set(true);

    }else{
      this.errorLogin.set(true);
      setTimeout(() => {
        this.errorLogin.set(false)
      }, 2000);
    }

    username.value = '';
    password.value = '';

  }
}
