import {
  Carrier,
  PackageAttribute,
  ShippingService,
  PackageType,
} from '@shipengine/connect-carrier-api';


const aPackage: PackageType = {
  Id: "a8195f65-8381-4a0e-8857-67deaa92ac3b",
  Name: "UPS Letter",
  CarrierPackageTypeCode: "01",
  Description: "Letter",
  Abbreviation: "Ltr",
  PackageAttributes: [
    PackageAttribute.International,
    PackageAttribute.Domestic,
  ] ,
  RequiredToShip: ["Weight"],
};

const aShippingService: ShippingService = {
  Id: "beb82e53-a5bb-4da3-a22a-be22c4e4e3c7",
  Name: "UPS Express®",
  Abbreviation: "Express",
  Code: "07",
  International: false,
  RequiredProperties: ["Dimensions", "Weight"],
  SupportedLabelSizes: ["Inches4x6"],
  SupportedCountries: [
    {
      FromCountry: "GB"
    },
    {
      FromCountry: "AU"
    }
  ],
  Class: "OneDayEarly",
  Grade: "Expedited",
  ServiceAttributes: ["Returns", "MultiPackage", "Tracking"]
};

export const CarrierOne: Carrier = {
  Id: '',
  Name: 'The First Carrier',
  Description: 'Babys first carrier',
  PackageTypes: [aPackage],
  ShippingServices: [aShippingService],
  ShippingOptions: [
    {
      Name: 'Contains Dry Ice',
      Type: 'contains-dry-ice',
    },
    {
      Name: 'Contains Alcohol',
      Type: 'contains-alcohol',
    }
  ],
  DefaultSupportedCountries: [
    {
      FromCountry: 'US',
    },
    {
      FromCountry: "GB",
    }
  ],
  DefaultLabelSizes: ['Inches4x6', 'Inches4x8'],
  LabelFormats: ['PDF', 'ZPL'],
  DefaultConfirmationTypes: null,
  CarrierAttributes: null,
  TrackingUrl: 'https://the.carrier.com/track',
  CarrierUrl: 'https://the.carrier.com',
};
