import { Component, OnInit } from '@angular/core';
import {TicketsService} from '../../services/tickets/tickets.service';
import {ITour} from '../../models/tours';
import {IMenuType} from '../../models/menuType'


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  tickets: ITour[];
  selectedType: IMenuType
  constructor(private ticketService: TicketsService) { }

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe((data: ITour[]) => {
      this.tickets = data;
    })
  }
  updateSelectedType(ev: IMenuType): void {
    this.selectedType = ev;
  }

}
