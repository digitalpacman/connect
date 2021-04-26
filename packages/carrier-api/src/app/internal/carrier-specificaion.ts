import { Carrier } from "../metadata/carrier";
import { AccountModals } from "../metadata/account-modals";
import { PackageType } from "../metadata/package-type";
import { ShippingService } from "../metadata/shipping-service";
import { ShippingOption } from "../metadata/shipping-option";
import { CountryAssociation } from "../metadata/country-association";
import { ConfirmationType } from "../metadata/confirmation-type";

export class CarrierSpecification {
  Id: string;
  Name: string;
  AccountModals?: AccountModals | null;
  PackageTypes?: PackageType[] | null;
  ShippingServices?: ShippingService[] | null;
  ShippingOptions?: ShippingOption[] | null;
  DefaultSupportedCountries?: CountryAssociation[] | null;
  DefaultLabelSizes?: ("Inches4x6" | "Inches4x8")[] | null;
  LabelFormats?: ("PDF" | "ZPL" | "PNG")[] | null;
  DefaultConfirmationTypes?: ConfirmationType[] | null;
  CarrierAttributes?:
    | ("ManifestDigital" | "ManifestPhysical" | "Consolidator" | "Regional")[]
    | null;
  TrackingUrl?: string | null;
  CarrierUrl?: string | null;
  Description?: string | null;

  constructor(definition: Carrier) {
    this.Id = definition.Id;
    this.Name = definition.Name;
    this.AccountModals = definition.AccountModals;
    this.PackageTypes = definition.PackageTypes;
    this.ShippingServices = definition.ShippingServices;
    this.ShippingOptions = definition.ShippingOptions;
    this.DefaultSupportedCountries = definition.DefaultSupportedCountries;
    this.DefaultLabelSizes = definition.DefaultLabelSizes;
    this.LabelFormats = definition.LabelFormats;
    this.DefaultConfirmationTypes = definition.DefaultConfirmationTypes;
    this.CarrierAttributes = definition.CarrierAttributes;
    this.TrackingUrl = definition.TrackingUrl;
    this.CarrierUrl = definition.CarrierUrl;
    this.Description = definition.Description;
  }
}
