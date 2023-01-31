import { Injectable } from '@angular/core';
import {TicketRestService} from '../rest/ticket-rest.service';
import {map, Observable, Subject} from 'rxjs';
import {ITour, INearestTour, ITourLocation} from '../../models/tours';
import {ITourTypeSelect, ICustomTicketData} from '../../models/tours'

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private ticketSubject = new Subject<ITourTypeSelect>();

  private ticketUpdateSubject = new Subject<ITour[]>();
  readonly ticketUpdateSubject$ = this.ticketUpdateSubject.asObservable();




  readonly ticketType$ = this.ticketSubject.asObservable();

  
  constructor(private ticketsServiceRest: TicketRestService) { }

 getTicketTypeObservable(): Observable<ITourTypeSelect> {
    return this.ticketSubject.asObservable();}

  updateTour(type:ITourTypeSelect): void {
    this.ticketSubject.next(type);
  }

  updateTicketList(data: ITour[]) {
    this.ticketUpdateSubject.next(data);
  }
  getTickets(): Observable<ITour[]> {
    return this.ticketsServiceRest.getTickets().pipe(map(
      (value:ITour[]) => {
        const singleTour = value.filter((el) => el.type === "single");
        return value.concat(singleTour);
      }
    ))
  }
  getError(): Observable<any> {
    return  this.ticketsServiceRest.getRestError();
  }
  getNearestTours(): Observable<INearestTour[]> {
    return this.ticketsServiceRest.getNearestTickets();
  }
  getTourLocations(): Observable<ITourLocation[]> {
    return this.ticketsServiceRest.getLocationList();
  }
  transformData(data: INearestTour[], regions: ITourLocation[]): ICustomTicketData[] {
    const newTicketData:  ICustomTicketData[] = [];
    data.forEach((el) => {
      const newEl = <ICustomTicketData>{...el};
      newEl.region = <ICustomTicketData>regions.find((region) => {return el.locationId === region.id});
      newTicketData.push(newEl);
    });
    return newTicketData
  }
  getRandomNearestEvent(type: number): Observable<INearestTour> {
    return this.ticketsServiceRest.getRandomNearestEvent(type);
  }
  sendTourData(data: any): Observable<any> {
    return this.ticketsServiceRest.sendTourData(data);
  }
  createTour(body: any) {
    return  this.ticketsServiceRest.createTour(body);
  }

}
