import { Observable } from 'rxjs';

/*
 * The global `window` variable is typed as an intersection of `Window` and `globalThis`.
 * We re-declare `window` here and omit `globalThis` as it is typed with the actual Yandex.Maps
 * types which we intend to override with mocks for testing. Keeping `globalThis`
 * would mean that `window` is not assignable to our testing window.
 */
declare let window: Window;

interface TestingWindow extends Window {
  ymaps?: {
    ready?: jest.Mock;
    geocode?: jest.Mock;
    Map?: jest.Mock;
    Placemark?: jest.Mock;
    GeoObject?: jest.Mock;
    Clusterer?: jest.Mock;
    ObjectManager?: jest.Mock;
    panorama?: {
      Player?: jest.Mock;
      locate?: jest.Mock;
    };
    multiRouter?: {
      MultiRoute?: jest.Mock;
    };
    control?: {
      RoutePanel?: jest.Mock;
    };
  };
}

/**
 * Mocks ymaps.ready.
 */
export const mockReady = (): jest.Mock => {
  const readyMock = jest.fn(() => new Observable((observer) => observer.next()));

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.ready = readyMock;
  } else {
    testingWindow.ymaps = {
      ready: readyMock,
    };
  }

  return readyMock;
};

/**
 * Mocks ymaps.geocode.
 */
export const mockGeocode = (): jest.Mock => {
  const geocodeMock = jest.fn(() => Promise.resolve({}));

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.geocode = geocodeMock;
  } else {
    testingWindow.ymaps = {
      geocode: geocodeMock,
    };
  }

  return geocodeMock;
};

/**
 * Mocks a ymaps.Map instance.
 */
export const mockMapInstance = () => ({
  events: {
    add: jest.fn(() => ({ remove: jest.fn() })),
  },
  behaviors: {
    enable: jest.fn(),
  },
  margin: {
    setDefaultMargin: jest.fn(),
  },
  controls: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  options: {
    set: jest.fn(),
  },
  geoObjects: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  setCenter: jest.fn(),
  setZoom: jest.fn(),
  setBounds: jest.fn(),
  setType: jest.fn(),
  destroy: jest.fn(),
});

/**
 * Mocks ymaps.Map.
 * @param mapInstance instance that is returned.
 */
export const mockMapConstructor = (mapInstance: ReturnType<typeof mockMapInstance>): jest.Mock => {
  const mapConstructorMock = jest.fn(() => mapInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.Map = mapConstructorMock;
  } else {
    testingWindow.ymaps = {
      Map: mapConstructorMock,
    };
  }

  return mapConstructorMock;
};

/**
 * Mocks a ymaps.Placemark instance
 */
export const mockPlacemarkInstance = () => ({
  events: {
    add: jest.fn(() => ({ remove: jest.fn() })),
  },
  geometry: {
    setCoordinates: jest.fn(),
  },
  properties: {
    set: jest.fn(),
  },
  options: {
    set: jest.fn(),
  },
});

/**
 * Mocks ymaps.Placemark
 * @param placemarkInstance instance that is returned
 */
export const mockPlacemarkConstructor = (
  placemarkInstance: ReturnType<typeof mockPlacemarkInstance>,
): jest.Mock => {
  const placemarkConstructorMock = jest.fn(() => placemarkInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.Placemark = placemarkConstructorMock;
  } else {
    testingWindow.ymaps = {
      Placemark: placemarkConstructorMock,
    };
  }

  return placemarkConstructorMock;
};

/**
 * Mocks a ymaps.GeoObject instance
 */
export const mockGeoObjectInstance = () => ({
  events: {
    add: jest.fn(() => ({ remove: jest.fn() })),
  },
  properties: {
    set: jest.fn(),
  },
  options: {
    set: jest.fn(),
  },
});

/**
 * Mocks ymaps.GeoObject
 * @param geoObjectInstance instance that is returned
 */
export const mockGeoObjectConstructor = (
  geoObjectInstance: ReturnType<typeof mockGeoObjectInstance>,
): jest.Mock => {
  const geoObjectConstructorMock = jest.fn(() => geoObjectInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.GeoObject = geoObjectConstructorMock;
  } else {
    testingWindow.ymaps = {
      GeoObject: geoObjectConstructorMock,
    };
  }

  return geoObjectConstructorMock;
};

/**
 * Mocks a ymaps.Clusterer instance
 */
export const mockClustererInstance = () => ({
  events: {
    add: jest.fn(() => ({ remove: jest.fn() })),
  },
  options: {
    set: jest.fn(),
  },
  add: jest.fn(),
  remove: jest.fn(),
});

/**
 * Mocks ymaps.Clusterer
 * @param clustererInstance instance that is returned
 */
export const mockClustererConstructor = (
  clustererInstance: ReturnType<typeof mockClustererInstance>,
): jest.Mock => {
  const clustererConstructorMock = jest.fn(() => clustererInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.Clusterer = clustererConstructorMock;
  } else {
    testingWindow.ymaps = {
      Clusterer: clustererConstructorMock,
    };
  }

  return clustererConstructorMock;
};

/**
 * Mocks a ymaps.ObjectManager instance
 */
export const mockObjectManager = () => ({
  events: {
    add: jest.fn(() => ({ remove: jest.fn() })),
  },
  options: {
    set: jest.fn(),
  },
  add: jest.fn(),
  remove: jest.fn(),
});

/**
 * Mocks ymaps.ObjectManager
 * @param objectManagerInstance instance that is returned
 */
export const mockManagerConstructor = (
  objectManagerInstance: ReturnType<typeof mockObjectManager>,
): jest.Mock => {
  const objectManagerConstructorMock = jest.fn(() => objectManagerInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.ObjectManager = objectManagerConstructorMock;
  } else {
    testingWindow.ymaps = {
      ObjectManager: objectManagerConstructorMock,
    };
  }

  return objectManagerConstructorMock;
};

/**
 * Mocks a ymaps.Player instance
 */
export const mockPlayer = () => ({
  events: {
    add: jest.fn(() => ({ remove: jest.fn() })),
  },
  moveTo: jest.fn(),
  setDirection: jest.fn(),
  setSpan: jest.fn(),
  destroy: jest.fn(),
});

/**
 * Mocks ymaps.panorama.locate.
 */
export const mockLocate = (): jest.Mock => {
  const locateMock = jest.fn(
    () =>
      new Observable((observer) => {
        observer.next([{}]);
      }),
  );

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps && testingWindow.ymaps.panorama) {
    testingWindow.ymaps.panorama.locate = locateMock;
  } else {
    testingWindow.ymaps = {
      panorama: {
        locate: locateMock,
      },
    };
  }

  return locateMock;
};

/**
 * Mocks ymaps.Player
 * @param playerInstance instance that is returned
 */
export const mockPlayerConstructor = (playerInstance: ReturnType<typeof mockPlayer>): jest.Mock => {
  const playerConstructorMock = jest.fn(() => playerInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps && testingWindow.ymaps.panorama) {
    testingWindow.ymaps.panorama.Player = playerConstructorMock;
  } else {
    testingWindow.ymaps = {
      panorama: {
        Player: playerConstructorMock,
      },
    };
  }

  return playerConstructorMock;
};

/**
 * Mocks a ymaps.Multiroute instance
 */
export const mockMultiroute = () => ({
  model: {
    setReferencePoints: jest.fn(),
    setParams: jest.fn(),
  },
  events: {
    add: jest.fn(() => ({ remove: jest.fn() })),
  },
  options: {
    set: jest.fn(),
  },
  moveTo: jest.fn(),
  setDirection: jest.fn(),
  setSpan: jest.fn(),
});

/**
 * Mocks ymaps.Multiroute
 * @param multirouteInstance instance that is returned
 */
export const mockMultirouteConstructor = (
  multirouteInstance: ReturnType<typeof mockMultiroute>,
): jest.Mock => {
  const multirouteConstructorMock = jest.fn(() => multirouteInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.multiRouter = {
      MultiRoute: multirouteConstructorMock,
    };
  } else {
    testingWindow.ymaps = {
      multiRouter: {
        MultiRoute: multirouteConstructorMock,
      },
    };
  }

  return multirouteConstructorMock;
};

/**
 * Mocks a ymaps.control.RoutePanel instance
 */
export const mockRoutePanel = () => ({
  routePanel: {
    state: {
      set: jest.fn(),
    },
  },
});

/**
 * Mocks ymaps.control.RoutePanel
 * @param routePanelInstance instance that is returned
 */
export const mockRoutePanelConstructor = (
  routePanelInstance: ReturnType<typeof mockRoutePanel>,
): jest.Mock => {
  const routePanelConstructorMock = jest.fn(() => routePanelInstance);

  const testingWindow: TestingWindow = window;

  if (testingWindow.ymaps) {
    testingWindow.ymaps.control = {
      RoutePanel: routePanelConstructorMock,
    };
  } else {
    testingWindow.ymaps = {
      control: {
        RoutePanel: routePanelConstructorMock,
      },
    };
  }

  return routePanelConstructorMock;
};
