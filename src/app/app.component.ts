import { Component } from '@angular/core';
import {ObservableExampleService} from './services/testing/observable-example.service';
import {ConfigService} from './services/config/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ticketSales2022';
  prop: string;

  constructor(private testing: ObservableExampleService,
              private config: ConfigService) {
    // testing.initObservable()
  }

  ngOnInit() {

    this.config.configLoad()

    const myObservable = this.testing.getObservable();
    myObservable.subscribe((data: string) => {
     //console.log('first myObservable data', data)
    });
    myObservable.subscribe((data: string) => {
     // console.log('second myObservable data', data)
    })

    const mySubject = this.testing.getSubject();
    mySubject.next ('subject value');

    //mySubject.subscribe((data: string) => {
     // console.log('first data subject', data)
    //});
    //mySubject.subscribe((data: string) => {
     // console.log('second data subject', data)
    //})
    mySubject.next ('subject value1');

    const myBehavior = this.testing.getBehaviorSubject();
    myBehavior.subscribe((data: string) => {
      console.log('first data behaviorSubject', data)
    });
    myBehavior.next('new data from behaviorSubject');
    myBehavior.next('new data1 from behaviorSubject')


  }
}
