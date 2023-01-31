import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import {ITour, INearestTour, ITourLocation} from '../../../models/tours';
import {ActivatedRoute} from '@angular/router';
import {TiсketsStorageService} from '../../../../app/services/tiсkets-storage/tiсkets-storage.service';
import {IUser} from '../../../models/users';
import {UserService} from '../../../services/user/user.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {TicketsService} from '../../../services/tickets/tickets.service';
import {Subscription, fromEvent, forkJoin} from 'rxjs';
import { IOrder } from 'src/app/models/order';

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit, OnDestroy {
  ticket: ITour | undefined;
  user: IUser | null;
  userForm: FormGroup;
  ticketSearchValue: string;

  nearestTours: INearestTour[];
  toursLocation: ITourLocation[];
  @ViewChild('ticketSearch') ticketSearch: ElementRef;
  searchTicketSub: Subscription;
  ticketRestSub: Subscription;
  searchTypes = [1,2,3]

  constructor(private route: ActivatedRoute,
              private ticketStorage: TiсketsStorageService,
              private userService: UserService,
              private ticketsService: TicketsService) { }

  ngOnInit(): void {
    // first get info
    this.user = this.userService.getUser();

    //init formGroup

    this.userForm = new FormGroup({
      firstName: new FormControl('', {validators: Validators.required}),
      lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
      cardNumber: new FormControl(),
      birthDay: new FormControl(''),
      age: new FormControl(),
      citizen: new FormControl('')
    })

    //get nearest tour
    forkJoin([this.ticketsService.getNearestTours(), this.ticketsService.getTourLocations()]).subscribe((data) => {
      this.nearestTours = data[0];
      this.toursLocation = data[1];
      this.nearestTours = this.ticketsService.transformData(data[0], data[1]);

    })

   // params
    const routeIdParam = this.route.snapshot.paramMap.get('id');
    const queryIdParam = this.route.snapshot.queryParamMap.get('id');

    const paramValueId = routeIdParam || queryIdParam;
    if(paramValueId) {
      const ticketStorage = this.ticketStorage.getStorage();
      this.ticket = ticketStorage.find((el) => el.id === paramValueId);
      console.log('this.ticket', this.ticket)
    }


    
  }
  ngAfterViewInit(): void {
    this.userForm.controls["cardNumber"].setValue(this.user?.cardNumber);
    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup');
    this.searchTicketSub = fromEventObserver.subscribe((ev: any) => {
      this.initSearchTour();
    })
  }
  ngOnDestroy(): void {
    this.searchTicketSub.unsubscribe();
  }

  initSearchTour(): void {

    const type = Math.floor(Math.random() * this.searchTypes.length);
    //unsubscribe
    if (this.ticketRestSub && !this.searchTicketSub.closed) {
      this.ticketRestSub.unsubscribe();
    }
    this.ticketRestSub = this.ticketsService.getRandomNearestEvent(type).subscribe((data) => {
      this.nearestTours = this.ticketsService.transformData([data], this.toursLocation)});
  }
  onSubmit(): void {
    console.log('xx')
  }

  selectDate(ev: Event): void {
  };

  
    initTour(): void{
      const userData=this.userForm.getRawValue();
      const postData={...this.ticket, ...userData};
      
      const userId= this.userService.getUser()?.id || null ;
      const postObj: IOrder = {
        age: postData.age,
       birthDay: postData.birthDay,
        cardNumber: postData.cardNumber,
        tourId: postData._id,
        userId: userId,
      }
          // console.log(postData, "postData");
          // console.log(this.userForm.getRawValue(), "this.userForm.getRawValue()");
          this.ticketsService.sendTourData(postObj).subscribe()
      

  }

}
