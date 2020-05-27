import ExternalSpec from './external/external-spec';
import CarrierSpecification from './external/carrier';
import ConfirmationType from './external/confirmation-type';
import DiagnosticRoutes from './external/diagnostic-routes';
import ShippingServiceSpecification from './external/shipping-service';
import ProviderFunction from './external/function';
import PackageType from './external/package-type';
import CountryAssociation from './external/country-association';
import {
    CarrierAttribute,
    RequiredProperty,
    ServiceClass,
    ServiceGrade,
    ShippingServiceAttribute,
    SupportedLabelSize,
} from './external/enums';
import {
    CarrierApp,
    Country,
    DeliveryConfirmation,
    DeliveryService,
    DeliveryServiceClass,
    DeliveryServiceGrade,
    DocumentSize,
    Packaging,
    ServiceArea,
} from '@shipengine/integration-platform-sdk';

const defaultDiagnosticRoutes: DiagnosticRoutes = {
    Liveness: 'diagnostics/heartbeat',
    Readiness: 'diagnostics/heartbeat',
    Version: 'diagnostics/version',
};

const mapFunctions = (app: CarrierApp): ProviderFunction[] => {
    const functions: ProviderFunction[] = [];
    if (typeof app.cancelPickups === 'function') {
        functions.push({
            Name: 'CancelPickup',
            IsSandboxed: false,
        });
    }

    if (typeof app.createShipment === 'function') {
        functions.push({
            Name: 'CreateLabel',
            IsSandboxed: false,
        });
    }

    if (typeof app.createManifest === 'function') {
        functions.push({
            Name: 'CreateManifest',
            IsSandboxed: false,
        });
    }
    if (typeof app.rateShipment === 'function') {
        functions.push({
            Name: 'GetRates',
            IsSandboxed: false,
        });
    }
    /* TODO: register/connect/login
    if (typeof app.login === 'function') {
        functions.push({
            Name: 'Register',
            IsSandboxed: false,
        });
    }
     */
    if (typeof app.schedulePickup === 'function') {
        functions.push({
            Name: 'SchedulePickup',
            IsSandboxed: false,
        });
    }
    if (typeof app.trackShipment === 'function') {
        functions.push({
            Name: 'Track',
            IsSandboxed: false,
        });
    }
    if (typeof app.cancelShipments === 'function') {
        functions.push({
            Name: 'VoidLabels',
            IsSandboxed: false,
        });
    }
    return functions;
};

const mapCarrierAttributes = (carrier: CarrierApp): CarrierAttribute[] => {
    const carrierAttributes: CarrierAttribute[] = [];
    /* TODO: follow up on manifest type
    if (carrier.requiresManifest === ManifestType.Digital) {
      carrierAttributes.push(CarrierAttribute.ManifestDigital);
    }
    if (carrier.requiresManifest === ManifestType.Physical) {
      carrierAttributes.push(CarrierAttribute.ManifestPhysical);
    }
     */
    if (carrier.isConsolidator) {
        carrierAttributes.push(CarrierAttribute.Consolidator);
    }
    if (carrier.serviceArea === ServiceArea.Regional) {
        carrierAttributes.push(CarrierAttribute.Regional);
    }
    return carrierAttributes;
};

const mapCountries = (countries: readonly Country[]): CountryAssociation[] => {
    const countryAssociations: CountryAssociation[] = [];
    countries.forEach((country) => {
        const countryAssociation: CountryAssociation = {
            FromCountry: country.toString(),
        };
        countryAssociations.push(countryAssociation);
    });
    return countryAssociations;
};

const mapShippingServiceAttributes = (service: DeliveryService): ShippingServiceAttribute[] => {
    const shippingServiceAttributes: ShippingServiceAttribute[] = [];
    /* TODO: DX service does not have allowsReturnService?
    if (service.isReturnService) {
        shippingServiceAttributes.push(ShippingServiceAttribute.Returns);
    }
     */
    if (service.allowsMultiplePackages) {
        shippingServiceAttributes.push(ShippingServiceAttribute.MultiPackage);
    }
    if (service.isTrackable) {
        shippingServiceAttributes.push(ShippingServiceAttribute.Tracking);
    }
    if (service.isConsolidationService) {
        shippingServiceAttributes.push(ShippingServiceAttribute.ConsolidatorService);
    }
    /* TODO: follow up on manifest type
    if (service.requiresManifest === ManifestType.Digital) {
      shippingServiceAttributes.push(ShippingServiceAttribute.ManifestDigital);
    }
    if (service.requiresManifest === ManifestType.Physical) {
      shippingServiceAttributes.push(ShippingServiceAttribute.ManifestPhysical);
    }

     */
    return shippingServiceAttributes;
};
const mapSupportedLabelSize = (labelSizes: readonly DocumentSize[]): SupportedLabelSize[] => {
    const supportedLabelSizes: SupportedLabelSize[] = [];
    labelSizes.forEach((labelSize: DocumentSize) => {
        switch (labelSize) {
            case DocumentSize.A4:
                console.error("A4 is not supported");
                break;
            case DocumentSize.Letter:
                console.error("Letter is not supported");
                break;
            case DocumentSize.Inches4x6:
                supportedLabelSizes.push(SupportedLabelSize.Inches4x6)
                break;
            case DocumentSize.Inches4x8:
                supportedLabelSizes.push(SupportedLabelSize.Inches4x8)
                break;
        }

    });
    return supportedLabelSizes;
};

const mapClass = (deliveryServiceClass: DeliveryServiceClass): ServiceClass => {
    switch (deliveryServiceClass) {
        case DeliveryServiceClass.Ground:
            return ServiceClass.Ground;
        case DeliveryServiceClass.OneDay:
            return ServiceClass.OneDay;
        case DeliveryServiceClass.OneDayEarly:
            return ServiceClass.OneDayEarly;
        case DeliveryServiceClass.OneDayEarlyAm:
            return ServiceClass.OneDayEarlyAm;
        case DeliveryServiceClass.TwoDay:
            return ServiceClass.TwoDay;
        case DeliveryServiceClass.TwoDayEarly:
            return ServiceClass.TwoDayEarly;
        case DeliveryServiceClass.ThreeDay:
            return ServiceClass.ThreeDay;
        default:
            return ServiceClass.Unspecified;
    }
};

const mapGrade = (deliveryServiceGrate: DeliveryServiceGrade): ServiceGrade => {
    switch (deliveryServiceGrate) {
        case DeliveryServiceGrade.Economy:
            return ServiceGrade.Economy;
        case DeliveryServiceGrade.Expedited:
            return ServiceGrade.Expedited;
        case DeliveryServiceGrade.Overnight:
            return ServiceGrade.Overnight;
        case DeliveryServiceGrade.Standard:
            return ServiceGrade.Standard;
        default:
            return ServiceGrade.Unspecified;
    }
};

const mapConfirmationTypes = (deliveryConfirmations: readonly DeliveryConfirmation[]): ConfirmationType[] => {
    const confirmationTypes: ConfirmationType[] = [];
    deliveryConfirmations.forEach((deliveryConfirmation) => {
        const confirmationType: ConfirmationType = {
            Name: deliveryConfirmation.name,
        };
        // STUCK
        // Cannot Map Id
        // Cannot Map Description
        // There is no mapping to existing SS definitions for Type (adult signature, delivery, none, etc)
        confirmationTypes.push(confirmationType);
    });
    return confirmationTypes;
};

const mapRequiredProperties = (service: DeliveryService): RequiredProperty[] => {
    const requiredProperties: RequiredProperty[] = [];
    if (service.requiresWeight) {
        requiredProperties.push(RequiredProperty.Weight);
    }
    if (service.requiresDimensions) {
        requiredProperties.push(RequiredProperty.Dimensions);
    }
    return requiredProperties;
};

const isInternationalService = (service: DeliveryService): boolean => {
    service.destinationCountries.forEach((destinationCountry) => {
        if (!service.originCountries.includes(destinationCountry)) {
            return false;
        }
    });
    return true;
};

const mapShippingService = (service: DeliveryService): ShippingServiceSpecification => {
    const shippingService: ShippingServiceSpecification = {
        Id: service.id,
        Name: service.name,
        Abbreviation: service.name.substring(0, 4), // This is not sent to us, since there is no product layer that can update this, we will initialize it to be a substring
        SupportedCountries: mapCountries(service.countries),
        Code: service.id, // We are mapping to the id because when the module gets called
        LabelCode: service.id, // We are mapping the LabelCode to the ServiceID, since this is hidden in the new spec
        ServiceAttributes: mapShippingServiceAttributes(service),
        SupportedLabelSizes: mapSupportedLabelSize(service.labelSizes),
        Class: mapClass(service.class),
        Grade: mapGrade(service.grade),
        ConfirmationTypes: mapConfirmationTypes(service.deliveryConfirmations),
        International: isInternationalService(service),
        RequiredProperties: mapRequiredProperties(service),
    };

    return shippingService;
};

const mapDeliveryServices = (services: readonly DeliveryService[]): ShippingServiceSpecification[] => {
    const shippingServices: ShippingServiceSpecification[] = [];
    services.forEach((service) => {
        shippingServices.push(mapShippingService(service));
    });
    return shippingServices;
};

const mapPackageTypes = (packaging: readonly Packaging[]): PackageType[] => {
    const packageTypes: PackageType[] = [];
    packaging.forEach((dxPackage) => {
        const packageType: PackageType = {
            Abbreviation: 'Not Supported',
            Id: dxPackage.id,
            Name: dxPackage.name,
            CarrierPackageTypeCode: dxPackage.id,
            Description: dxPackage.description,
        };
        packageType.RequiredToShip = [];
        if (dxPackage.requiresDimensions) {
            packageType.RequiredToShip.push(RequiredProperty.Dimensions);
        }
        if (dxPackage.requiresWeight) {
            packageType.RequiredToShip.push(RequiredProperty.Weight);
        }
        packageTypes.push(packageType);
    });
    return packageTypes;
};

const dxToCarrierSpecification = (app: CarrierApp): CarrierSpecification => {
    if (!app) {
        throw new Error('Unable to map null ShippingProviderApp');
    }
    const carrierSpecification: CarrierSpecification = {
        Id: "", // carrier-id should come from DX WebAPI
        Name: "", // TODO: confirm carrier name should come from DX WebAPI
        ShippingOptions: [], // This needs to be moved to the service level
        /* TODO forms
            AccountModals: {
            RegistrationFormSchema: {
                formSchema: app.carrier.loginForm.dataSchema,
                uiSchema: app.loginForm.uiSchema,
            },
            SettingsFormSchema: {
                formSchema: app ? (carrier.connsettingsForm ? app.settingsForm.dataSchema : {}) : {},
                uiSchema: app ? (app.settingsForm ? app.settingsForm.uiSchema : {}) : {},
            },
        },*/
        CarrierAttributes: mapCarrierAttributes(app),
        CarrierUrl: "",//app.websiteURL.toString(), //TODO: Carrier App websiteURL disappeared
        // TrackingUrl: app.getTrackingURL({id: ''}, {}).toString(), // TODO tracking url
        ShippingServices: mapDeliveryServices(app.deliveryServices),
        PackageTypes: mapPackageTypes(app.packaging),
    };
    return carrierSpecification;
};

export default (app: CarrierApp): ExternalSpec => {
    const provider: ExternalSpec = {
        Id: "", //app-id is provided by DX WebAPI
        Name: "", // TODO: confirm carrier name should come from DX WebAPI
        Carriers: [dxToCarrierSpecification(app)]
    };
    return provider;
};
