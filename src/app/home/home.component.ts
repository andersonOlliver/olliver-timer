import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { interval, Subscription } from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dia = '';
  diaMes = '';
  date: Date;
  dateLabel = '00:00:00';
  dHour = '';
  dMinute = '';
  dSecond = '';
  timerId: Subscription;
  posHour = {x: 0, y: 0};
  posMinute = {x: 0, y: 0};
  posSecond = {x: 0, y: 0};

  constructor() {
    moment.locale('pt-BR');
  }

  ngOnInit() {
    this.dia = moment().format('dddd');
    this.diaMes = moment().format('D MMMM');

  }

  iniciar() {
    const time = localStorage.getItem('momento');
    if (time) {
      this.dateLabel = time;
    }
    this.timerId = interval(1000).subscribe(() => this.setCaptions());
  }

  limpar() {
    if (this.timerId != null) {
      this.timerId.unsubscribe();
      this.dateLabel = '00:00:00';
    }
    localStorage.removeItem('momento');
  }

  parar() {
    if (this.timerId != null) {
      localStorage.setItem('momento', this.dateLabel);
      this.timerId.unsubscribe();
    }
  }

  setCaptions() {
    let segundos = moment.duration(this.dateLabel).asSeconds();

    segundos++;
    const temp = moment().startOf('day').second(segundos);
    this.dateLabel = temp.format('H:mm:ss');
    this.date = moment().startOf('day').second(segundos).toDate();
    this.changeCircles();
  }

  private changeCircles() {
    const hour = this.date.getHours() % 12;
    const minute = this.date.getMinutes();
    const seconds = this.date.getSeconds();
    const hourArc = (hour * 60 + minute) / (12 * 60) * 360;
    const minArc = minute / 60 * 360;
    const secArc = seconds / 60 * 360;

    this.dHour = this.describeArc(520, 240, 170, 0, hourArc);
    this.dMinute = this.describeArc(520, 240, 190, 0, minArc);
    this.dSecond = this.describeArc(520, 240, 210, 0, secArc);
    this.posHour = this.polarToCartesian(520, 240, 170, hourArc);
    this.posMinute = this.polarToCartesian(520, 240, 190, minArc);
    this.posSecond = this.polarToCartesian(520, 240, 210, secArc);
  }

  describeArc(x, y, radius, startAngle, endAngle) {
    const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const start = this.polarToCartesian(x, y, radius, endAngle);

    return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ');
  }

  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

}
