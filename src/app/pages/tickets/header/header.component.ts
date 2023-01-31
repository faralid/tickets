import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {UserService} from '../../../services/user/user.service';
import {IUser} from '../../../models/users';
import {IMenuType} from '../../../models/menuType'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() menuType: IMenuType;
   items: MenuItem[];
   time: Date;
   user: IUser | null;
   userName: string;
   private settingsActive = false;

   private timerInterval: number;

  constructor(
    private userService: UserService) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Билеты',
        routerLink: ['tickets-list']
      },
      {
        label: 'Выйти',
        routerLink: ['/auth'],
        command: () => {
          this.userService.removeUser()
        }

      }
      ];

    this.timerInterval = window.setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.user = this.userService.getUser();
    //const authUser: IUser  = this.userService.getUser();
    //this.user = authUser;
    //this.userName = authUser.login
  }

  ngOnDestroy(): void{
    if(this.timerInterval) {
      window.clearInterval(this.timerInterval);
    }
  }
  ngOnChanges(ev: SimpleChanges): void {
    if (ev['menuType']) {
      this.settingsActive = this.menuType?.type === "extended";
    this.items = this.initMenuItems();}
  }
  initMenuItems():MenuItem[] {
    return [
      {
        label: 'Билеты',
        routerLink:['tickets-list']
      },
      {
        label: 'Настройки',
        routerLink:['settings'],
        visible: this.settingsActive
      },
      {
        label: 'Выйти',
        routerLink:['/auth']
      },

    ];
  }
}
