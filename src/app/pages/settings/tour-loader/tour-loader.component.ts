import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { ITour } from 'src/app/models/tours';

@Component({
  selector: 'app-tour-loader',
  templateUrl: './tour-loader.component.html',
  styleUrls: ['./tour-loader.component.scss']
})
export class TourLoaderComponent implements OnInit {
  tourForm: FormGroup;
  constructor(private ticketService: TicketsService) { }

  ngOnInit(): void {
    this.tourForm = new FormGroup({
      name:  new FormControl('', {validators: Validators.required}),
      description: new FormControl('', [Validators.required, Validators.minLength(2)]),
      operator: new FormControl(),
      price: new FormControl(),
      img: new FormControl()
    })
  }

  createTour(): void {
    const tourDataRow = this.tourForm.getRawValue();
    let formParams = new FormData();
    if (typeof tourDataRow === "object") {
      for ( let prop in tourDataRow){
        formParams.append( prop , tourDataRow[prop]);
      }
    }
    this.ticketService.createTour(formParams).subscribe((data) => {});
  }


  selectFile(ev: any): void {
    if (ev.target.files.length > 0) {
      const file= ev.target.files[0];
      this.tourForm.patchValue({
        img: file
      });
    }
  }
}

