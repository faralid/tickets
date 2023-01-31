import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { UserService } from 'src/app/services/user/user.service';
import {IUser} from "../../../models/users";
import {AuthService} from "../../../services/auth/auth.service";
import {ConfigService} from '../../../services/config/config.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { ServerError } from 'src/app/models/error';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  login: string;
  psw: string;
  pswRepeat: string;
  email: string;
  cardNumber: string;
  saveUserInStore: boolean;
  showCardNumber: boolean;
  //id: number;

  constructor(private messageService: MessageService,
              private authService: AuthService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.showCardNumber = ConfigService.config.useUserCard;
  }
  registration(ev: Event): void | boolean{
    if (this.psw !== this.pswRepeat) {
      this.messageService.add({severity:'error', summary:'Пароли не совпадают'});
      return false;
    }
    const userObj: IUser = {
      psw: this.psw,
      cardNumber: this.cardNumber,
      login: this.login,
      email: this.email,
     //id: this.id,
    }

   
    //if (!this.authService.isUserExists(userObj)) {
    //  this.authService.setUser(userObj);
    //  if(this.saveUserInStore){
    //    const objUserJsonStr = JSON.stringify(userObj);
   //     window.localStorage.setItem('user_'+userObj.login, objUserJsonStr);
    //  }
    //  this.messageService.add({severity: 'success', summary: 'Регистрация прошла успешно'});
    //} else {
    //  this.messageService.add({severity: 'warn', summary: 'Пользователь уже зарегистрирован'})
    //}

   // this.http.post<IUser>('http://localhost:4000/users', userObj).subscribe((data:IUser) => {
   //   if (this.saveUserInStore) {
     //   const objUserJsonStr = JSON.stringify(userObj);
       // window.localStorage.setItem('user_'+userObj.login, objUserJsonStr);
       // }
       // this.messageService.add({severity: 'success', summary: 'Регистрация прошла успешно'});

    // }, () => {
  //  this.messageService.add({severity: 'warn', summary: 'Пользователь уже зарегистрирован'});
   // });
 // }


 this.http.post<IUser>('http://localhost:3000/users/', userObj).subscribe((data) => {
  if (this.saveUserInStore) {
    const objUserJsonStr = JSON.stringify(userObj);
    window.localStorage.setItem('user_'+userObj.login, objUserJsonStr);
  }
  this.messageService.add({severity:'success', summary:'Регистрация прошла успешно'});

}, (err: HttpErrorResponse)=> {
  console.log('err', err)
  const ServerError = <ServerError>err.error;
  this.messageService.add({severity:'warn', summary: ServerError.errorText});
});

  }
 
}
