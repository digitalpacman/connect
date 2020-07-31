import {
  CarrierApp,
  DeliveryService,
  NewShipmentPOJO,
  NewPackagePOJO,
  WeightUnit,
  DeliveryConfirmation,
} from "@shipengine/integration-platform-sdk";
import Suite from "../runner/suite";
import {
  CreateShipmentDomesticConfigOptions,
  CreateShipmentDomesticTestParams,
} from "../runner/config/create-shipment-domestic";
import { initializeTimeStamps } from "../../utils/time-stamps";
import reduceDefaultsWithConfig from '../utils/reduce-defaults-with-config';
import objectToTestTitle from '../utils/object-to-test-title';
import useDomesticShippingAddress from '../utils/use-domestic-shipment-addresses';

import { findDomesticDeliveryService } from '../utils/find-domestic-delivery-service';
import { expect } from "chai";
import findDeliveryServiceByName from '../utils/find-delivery-service-by-name';
import findDeliveryConfirmationByName from '../utils/find-delivery-confirmation-by-name';

interface TestArgs {
  title: string;
  methodArgs: NewShipmentPOJO;
  config: any;
}

export class CreateShipmentDomestic extends Suite {
  title = "createShipment_domestic";

  private deliveryService?: DeliveryService;
  private deliveryConfirmation?: DeliveryConfirmation;

  private setDeliveryService(
    config: CreateShipmentDomesticConfigOptions,
  ): void {
    const carrierApp = this.app as CarrierApp;

    if (config.deliveryServiceName) {
      this.deliveryService = findDeliveryServiceByName(
        config.deliveryServiceName,
        carrierApp,
      );
    } else {
      try {
        this.deliveryService = findDomesticDeliveryService(carrierApp);
      } catch {
        this.deliveryService = undefined;
      }
    }
  }

  private setDeliveryConfirmation(
    config: CreateShipmentDomesticConfigOptions,
  ): void {
    if (config.deliveryConfirmationName) {
      // We do not want to handle the exception here if this raises. It indicates issues w/ the config provided.
      this.deliveryConfirmation = findDeliveryConfirmationByName(
        config.deliveryConfirmationName,
        this.app as CarrierApp,
      );
    } else if (
      this.deliveryService &&
      this.deliveryService.deliveryConfirmations.length !== 0 &&
      this.deliveryService.deliveryConfirmations[0]
    ) {
      this.deliveryConfirmation = this.deliveryService.deliveryConfirmations[0];
    } else {
      this.deliveryConfirmation = undefined;
    }
  }

  buildTestArg(
    config: CreateShipmentDomesticConfigOptions,
  ): TestArgs | undefined {
    this.setDeliveryService(config);
    this.setDeliveryConfirmation(config);

    if (!this.deliveryService) return undefined;

    let shipFrom, shipTo;
    if (!config.shipFrom && !config.shipTo) {
      [shipFrom, shipTo] = useDomesticShippingAddress(this.deliveryService);
    }

    if (!shipFrom || !shipTo) return undefined;

    const { tomorrow } = initializeTimeStamps();

    // Make a best guess at the defaults, need to resolve the default vs config based delivery service early
    // on since that determines what address and associated timezones get generated.
    const defaults: CreateShipmentDomesticTestParams = {
      deliveryServiceName: this.deliveryService.name,
      label: {
        size: this.deliveryService.labelSizes[0],
        format: this.deliveryService.labelFormats[0]
      },
      shipDateTime: tomorrow,
      shipFrom: shipFrom,
      shipTo: shipTo,
      weight: {
        unit: WeightUnit.Pounds,
        value: 50.0,
      }
    };

    if (this.deliveryService.deliveryConfirmations.length > 0) {
      defaults.deliveryConfirmationName = this.deliveryService.deliveryConfirmations[0].name;
    }

    const testParams = reduceDefaultsWithConfig<
      CreateShipmentDomesticTestParams
    >(defaults, config);

    const packagePOJO: NewPackagePOJO = {
      packaging: {
        id: this.deliveryService.packaging[0].id
      },
      label: {
        size: testParams.label.size,
        format: testParams.label.format,
      },
      weight: {
        value: testParams.weight.value,
        unit: testParams.weight.unit,
      },
    };

    if (this.deliveryConfirmation) {
      packagePOJO.deliveryConfirmation = {
        id: this.deliveryConfirmation.id,
      };
    }

    if (this.deliveryService.deliveryConfirmations.length > 0) {
      packagePOJO.deliveryConfirmation = {
        id: this.deliveryService.deliveryConfirmations[0].id,
      };
    }

    if (testParams.deliveryConfirmationName) {
      packagePOJO.deliveryConfirmation = {
        id: this.deliveryService.deliveryConfirmations.find(
          (dc) => dc.name === testParams.deliveryConfirmationName,
        )!.id,
      };
    }

    let newShipmentPOJO: NewShipmentPOJO = {
      deliveryService: {
        id: this.deliveryService.id,
      },
      shipFrom: testParams.shipFrom!,
      shipTo: testParams.shipTo!,
      shipDateTime: testParams.shipDateTime,
      packages: [packagePOJO],
    };

    const title = config.expectedErrorMessage
      ? `it raises an error when creating a new domestic shipment with ${objectToTestTitle(
        testParams,
      )}`
      : `it creates a new domestic shipment with ${objectToTestTitle(
        testParams,
      )}`;

    return {
      title,
      methodArgs: newShipmentPOJO,
      config,
    };
  }

  buildTestArgs(): Array<TestArgs | undefined> {
    if (Array.isArray(this.config)) {
      return this.config.map((config: CreateShipmentDomesticConfigOptions) => {
        return this.buildTestArg(config);
      });
    } else {
      const config = this.config as CreateShipmentDomesticConfigOptions;

      return [this.buildTestArg(config)];
    }
  }

  tests() {
    const testArgs = this.buildTestArgs().filter((args) => args !== undefined);

    if (testArgs.length === 0) {
      return [];
    }
    return testArgs.map((testArg) => {
      return this.test(
        testArg!.title,
        testArg!.methodArgs,
        testArg!.config,
        async () => {
          const carrierApp = this.app as CarrierApp;

          const transaction = await this.transaction(testArg!.config);

          if (!carrierApp.createShipment) {
            throw new Error("createShipment is not implemented");
          }

          const shipmentConfirmation = await carrierApp.createShipment(transaction, testArg!.methodArgs);

          // If DeliveryServiceDefinition.isTrackable is true, then the shipment must have a trackingNumber set
          if (this.deliveryService?.isTrackable) {
            const customMsg = "The shipmentConfirmation.isTrackable returned from createShipment must be present when the given deliveryService.isTrackable is set to 'true'";
            expect(shipmentConfirmation.trackingNumber, customMsg).to.be.ok;
          }

          const customMsg = "The shipment confirmation packages array should have the same number of packages that were on the request";
          expect(shipmentConfirmation.packages.length).to.equal(testArg!.methodArgs.packages.length, customMsg);
        }
      );
    });
  }
}
