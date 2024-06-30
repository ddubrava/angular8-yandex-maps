import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { YaMapComponent } from '../ya-map/ya-map.component';
import { filter } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import { YMap, YMapDefaultSchemeLayer, YMapDefaultSchemeLayerProps } from '@yandex/ymaps3-types';
import { GenericEntity } from '@yandex/ymaps3-types/imperative/Entities';

@Directive({
  selector: 'ya-map-default-scheme-layer',
  // standalone: true,
})
export class YaMapDefaultSchemeLayerDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  /**
   * The value of input props.
   */
  @Input() props: YMapDefaultSchemeLayerProps = {};

  @Input() children?: GenericEntity<unknown, object, YMap>[];

  /**
   * Optional options object.
   */
  @Input() options?: ConstructorParameters<typeof YMapDefaultSchemeLayer>[2];

  constructor(private readonly yaMapComponent: YaMapComponent) {}

  ngOnInit(): void {
    this.yaMapComponent.map$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((map) => {
      if (this.children) {
        map.addChild(new ymaps3.YMapDefaultSchemeLayer(this.props, this.children, this.options));
      } else {
        map.addChild(new ymaps3.YMapDefaultSchemeLayer(this.props, this.options));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
