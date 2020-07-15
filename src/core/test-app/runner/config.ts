import {
  Address,
  DateTimeZonePOJO,
  WeightUnit,
} from "@shipengine/integration-platform-sdk";

export interface TestOptions {
  debug?: boolean;
  expectedErrorMessage?: string;
  retries?: number;
  skip?: boolean;
  timeout?: number;
}

export interface CreateShipmentDomesticOptions extends TestOptions {
  shipFrom?: Address;
  shipTo?: Address;
  weightValue?: number;
  weightUnit?: WeightUnit;
  shipDateTime?: DateTimeZonePOJO | Date | string;
  deliveryServiceName?: string;
}

export interface CreateShipmentInternationalOptions extends TestOptions {
  shipFrom?: Address;
  shipTo?: Address;
  weightValue?: number;
  weightUnit?: WeightUnit;
  shipDateTime?: DateTimeZonePOJO | Date | string;
  deliveryServiceName?: string;
  deliveryConfirmationName?: string;
}

export interface TestsConfig {
  cancelPickups?: (TestOptions & TestOptions) | [TestOptions];
  cancelShipments?: TestOptions | [TestOptions];
  createManifest?: TestOptions | [TestOptions];
  createShipment_domestic?:
    | CreateShipmentDomesticOptions
    | [CreateShipmentDomesticOptions];
  createShipment_international?:
    | CreateShipmentInternationalOptions
    | [CreateShipmentInternationalOptions];
  createShipment_multi_package?: TestOptions | [TestOptions];
  rateShipment?: TestOptions | [TestOptions];
  schedulePickup?: TestOptions | [TestOptions];
  trackShipment?: TestOptions | [TestOptions];
}

export default interface Config {
  connect_credentials?: object;
  concurrency?: number;
  debug?: boolean;
  failFast?: boolean;
  retries?: number;
  timeout?: number;
  tests?: TestsConfig;
}
