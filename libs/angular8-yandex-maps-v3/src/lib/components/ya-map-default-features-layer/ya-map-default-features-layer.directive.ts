import { Directive, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { YMapDefaultFeaturesLayer, YMapDefaultFeaturesLayerProps } from '@yandex/ymaps3-types';
import { YaMapComponent } from '../ya-map/ya-map.component';
import { filter } from 'rxjs/operators';

@Directive({
  selector: 'ya-map-default-features-layer',
  // standalone: true,
})
export class YaMapDefaultFeaturesLayerDirective {
  private readonly destroy$ = new Subject<void>();

  /**
   * The value of input props.
   */
  @Input() props: YMapDefaultFeaturesLayerProps = {};

  @Input() children?: ConstructorParameters<typeof YMapDefaultFeaturesLayer>[1];

  /**
   * Optional options object.
   */
  @Input() options?: ConstructorParameters<typeof YMapDefaultFeaturesLayer>[2];

  constructor(private readonly yaMapComponent: YaMapComponent) {}

  ngOnInit(): void {
    this.yaMapComponent.map$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((map) => {
      if (this.children) {
        map.addChild(new ymaps3.YMapDefaultFeaturesLayer(this.props, this.children, this.options));
      } else {
        map.addChild(new ymaps3.YMapDefaultFeaturesLayer(this.props, this.options));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
