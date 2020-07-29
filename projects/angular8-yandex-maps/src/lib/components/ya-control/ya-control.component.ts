import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { ILoadEvent } from '../../models/models';
import { removeLeadingSpaces } from '../../utils/removeLeadingSpaces';

@Component({
  selector: 'ya-control',
  templateUrl: './ya-control.component.html',
  styleUrls: ['./ya-control.component.scss']
})
export class YaControlComponent implements OnInit {
  @Input() public type: string;
  @Input() public parameters: any;

  @Output() public load = new EventEmitter<ILoadEvent>();

  constructor() {}
  public ngOnInit(): void {}

  public initControl(ymaps: any, map: any): void {
    const control = new ymaps.control[this.type](this.parameters);

    // RoutePanel ignores state in parameters. API bug
    if (this.type === 'RoutePanel' && this.parameters && this.parameters.state) {
      control.routePanel.state.set({ ...this.parameters.state });
    }

    map.controls.add(control);
    this.load.emit({ ymaps, instance: control });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._configControl(changes);
  }

  private _configControl(changes: SimpleChanges): void {
    for (const key in changes) {
      if (changes[key].firstChange) return;
    }

    console.error(removeLeadingSpaces(`
      Control doesn't support dynamic configuartion.

      Solutions:
      1. Use ymaps from ILoadEvent
      2. Recreate component with new configuration
    `));
  }
}
