import { Component, OnInit } from "@angular/core";
import {AuthService} from "../../../services/auth/auth.service";
import {IUser} from "../../../models/users";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {UserService} from '../../../../app/services/user/user.service';
import {ConfigService} from '../../../services/config/config.service';
import {HttpClient} from '@angular/common/http';
import { ServerError } from 'src/app/models/error';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})

export class AuthorizationComponent implements OnInit {
  loginText= 'Логин';
  pswText= 'Пароль';
  psw: string;
  login: string;
  selectedValue: boolean;
  cardNumber: string;
  authTextButton: string;
  useCardNumber: boolean;
  id: number;


  constructor(private authService: AuthService,
              private router: Router,
              private messageService: MessageService,
              private userService: UserService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.authTextButton = "Авторизоваться";
    this.useCardNumber = ConfigService.config.useUserCard;
  }

  ngOnDestroy(): void{
    //console.log('destroy');
  }

  vipStatusSelected():void{

  }
  onAuth(ev: Event):void{
    const authUser: IUser = {
      psw : this.psw,
      login : this.login,
      cardNumber: this.cardNumber,
      
    }
  
  this.http.post<{access_token: string, id: string}>('http://localhost:3000/users/'+authUser.login, authUser).subscribe((data) => {
  authUser.id = data.id;
  this.userService.setUser(authUser);
  const token: string = data.access_token;
  this.userService.setToken(token);
  this.userService.setToStore(token);


  this.router.navigate(['tickets/tickets-list']);

}, (err)=> {
  const ServerError = <ServerError>err.error;
  this.messageService.add({severity:'warn', summary: ServerError.errorText});
});

  }


}
