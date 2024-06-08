import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { AngularYandexMapsModule } from './angular-yandex-maps.module';
import { YaConfig } from './interfaces/ya-config';
import { YA_CONFIG } from './tokens/ya-config';

describe('AngularYandexMapsModule', () => {
  it('should provide default YaConfig when forRoot is not called', () => {
    TestBed.configureTestingModule({
      imports: [AngularYandexMapsModule],
    });

    expect(TestBed.inject(YA_CONFIG)).toEqual({});
  });

  it('should provide YaConfig when forRoot is called', () => {
    const config: YaConfig = {
      apikey: 'X-X-X',
      lang: 'en_US',
    };

    TestBed.configureTestingModule({
      imports: [AngularYandexMapsModule.forRoot(config)],
    });

    expect(TestBed.inject(YA_CONFIG)).toEqual(config);
  });

  it('should accept observable YaConfig', () => {
    const config: Observable<YaConfig> = of({
      apikey: 'X-X-X',
      lang: 'en_US',
    });

    TestBed.configureTestingModule({
      imports: [AngularYandexMapsModule.forRoot(config)],
    });

    expect(TestBed.inject(YA_CONFIG)).toEqual(config);
  });
});
