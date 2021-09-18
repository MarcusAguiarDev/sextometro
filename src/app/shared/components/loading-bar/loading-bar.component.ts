import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('loaderBg') loaderBg: ElementRef<HTMLElement>;
  @ViewChild('loaderMask') loaderMask: ElementRef<HTMLElement>;
  @ViewChild('pointer') pointer: ElementRef<HTMLElement>;
  @ViewChild('textoSextou') textoSextou: ElementRef<HTMLElement>;

  toFriday: RemainingTime = {
    decimalDays: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  remainingTimeText = '';
  timer: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    this.startAnimation();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  startAnimation() {

    let percentage = 0;
    this.setLoader(percentage);


    const daysInWeek = 7;

    this.timer = setInterval(() => {

      const remainingTime: RemainingTime = this.getRemainingTimeToFriday();
      const finalPercentage = 100 - ((100 / daysInWeek) * remainingTime.decimalDays);

      if (percentage >= finalPercentage)
        this.fillRemainingTimeText(remainingTime);
      else
        this.setLoader(percentage += .5);

      if (percentage == 100)
        this.reach100();

    }, 50);
  }

  fillRemainingTimeText(remainingTime: RemainingTime) {
    this.remainingTimeText = this.getRemainingTimeText(remainingTime);
  }

  getRemainingTimeText(remainingTime: RemainingTime) {

    if (remainingTime.days > 0 && remainingTime.hours > 0 && remainingTime.minutes > 0 && remainingTime.seconds > 0)
      return `Faltam ${remainingTime.days} dias, ${remainingTime.hours} horas, ${remainingTime.minutes} minutos e ${remainingTime.seconds} segundos para sexta-feira!`;
    else if (remainingTime.hours > 0 && remainingTime.minutes > 0 && remainingTime.seconds > 0)
      return `Faltam ${remainingTime.hours} horas, ${remainingTime.minutes} minutos e ${remainingTime.seconds} segundos para sexta-feira!`;
    else if (remainingTime.minutes > 0 && remainingTime.seconds > 0)
      return `Faltam ${remainingTime.minutes} minutos e ${remainingTime.seconds} segundos para sexta-feira!`;
    else if (remainingTime.seconds > 0)
      return `Faltam ${remainingTime.seconds} segundos para sexta-feira!`;
    else
      return 'Hoje é sexta-feira!!!';
  }

  getRemainingTimeToFriday(): RemainingTime {

    const weekday = moment().weekday();
    const friday = 5;

    //sextou
    if (weekday === friday) {
      return {
        decimalDays: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    } else {
      let daysToFriday = 0;

      let currentDay = weekday;
      const lastDayOfWeek = 7;
      const firstDayOfWeek = 1;

      while (currentDay !== friday) {
        if (currentDay < lastDayOfWeek)
          currentDay++;
        else
          currentDay = firstDayOfWeek;

        daysToFriday++;
      }
      const nextFriday = moment().add(daysToFriday, 'day').startOf('day');
      const daysToNextFriday = nextFriday.diff(moment(), 'days', true);

      return {
        decimalDays: daysToNextFriday,
        days: nextFriday.diff(moment(), 'days'),

        hours: 24 - Math.ceil(moment()
          .set('date', nextFriday.get('date'))
          .set('month', nextFriday.get('month'))
          .set('year', nextFriday.get('year'))
          .diff(nextFriday, 'hours', true)),

        minutes: 60 - Math.ceil(moment()
          .set('date', nextFriday.get('date'))
          .set('month', nextFriday.get('month'))
          .set('year', nextFriday.get('year'))
          .set('hour', nextFriday.get('hour'))
          .diff(nextFriday, 'minutes', true)),
        seconds: 60 - Math.trunc(moment()
          .set('date', nextFriday.get('date'))
          .set('month', nextFriday.get('month'))
          .set('year', nextFriday.get('year'))
          .set('hour', nextFriday.get('hour'))
          .set('minute', nextFriday.get('minute'))
          .diff(nextFriday, 'seconds', true)),
      };
    }
  }

  reach100() {
    this.loaderBg.nativeElement.classList.add('blink-green');
    this.textoSextou.nativeElement.style.visibility = 'visible';
  }

  setLoader(percentage: number) {
    this.setMaskPosition(this.loaderMask, percentage);
    this.setPointerPosition(this.pointer, percentage);
  }

  setMaskPosition(loader: ElementRef<HTMLElement>, percentage: number) {

    loader.nativeElement.style.width = (100 - percentage) + '%';
  }

  setPointerPosition(pointer: ElementRef<HTMLElement>, percentage: number) {

    pointer.nativeElement.style.left = percentage + '%';
  }
}

export interface RemainingTime {
  decimalDays: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}