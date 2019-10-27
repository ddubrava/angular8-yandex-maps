import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'angular-yandex-multiroute',
  templateUrl: './yandex-multiroute.component.html',
  styleUrls: ['./yandex-multiroute.component.scss']
})
export class YandexMultirouteComponent implements OnInit {
  @Input() public referencePoints: Array<any> = [];
  @Input() public multirouteModel: any;
  @Input() public multirouteOptions: any;

  constructor() { }

  public ngOnInit(): void {
    this._logErrors();
  }

  private _logErrors(): void {
    if (!this.referencePoints.length) console.error('Multiroute: referencePoints is required');
  }
}
