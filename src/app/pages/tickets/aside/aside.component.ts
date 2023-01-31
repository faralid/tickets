import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {IMenuType} from '../../../models/menuType';
import {ITourTypeSelect} from '../../../models/tours';
import {TicketsService} from '../../../services/tickets/tickets.service';
import {MessageService} from "primeng/api";
import {SettingsService} from '../../../services/settings/settings.service';
import { subscribeOn } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ITour } from '../../../models/tours';



@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
@Output()

export class AsideComponent implements OnInit {
  menuTypes: IMenuType[];
  obj = {type: 'custom', label: 'Обычное'}
  selectedMenuType: IMenuType;
  tourTypes: ITourTypeSelect[] = [
    {label: 'Все', value: 'all'},
    {label: 'Одиночный', value: 'single'},
    {label: 'Групповой', value: 'multi'}
  ]
  @Output() updateMenuType: EventEmitter<IMenuType> = new EventEmitter()

  constructor(private ticketService: TicketsService,
              private settingsService: SettingsService,
              private messageService: MessageService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.menuTypes = [
      {type: 'custom', label : 'Обычное'},
      {type: 'extended', label : 'Расширенное'}
    ]
  }
  changeType(ev: {ev: Event, value: IMenuType}): void {
    console.log('ev', ev)
    this.updateMenuType.emit(ev.value);
  }
  changeTourType(ev:  {ev: Event, value: ITourTypeSelect}): void {
    this.ticketService.updateTour(ev.value)
  }
  selectDate(ev: string) {
    this.ticketService.updateTour({date:ev})
  }

  initRestError(): void {
    this.ticketService.getError().subscribe({next: (data) => {
      },
    error:(err) => {
      this.messageService.add({severity: 'success', summary: 'Error'});
      console.log('err', err)
    },
      complete: () => {}
    })
  }
  initSettingsData(): void {
    this.settingsService.loadUserSettingsSubject({
        saveToken: false
      });
  }

  initTours():void {
    this.http.post<ITour[]>("http://localhost:3000/tours/", {}).subscribe((data)=>{
     this.ticketService.updateTicketList(data);
    });
  }
  deleteTours():void {
    this.http.delete("http://localhost:3000/tours/").subscribe((data)=>{
      this.ticketService.updateTicketList([]);
    });
  }
}
