import { Address, AddressResidentialIndicator } from '@ipaas/capi';
import {
  AddressWithContactInfoPOJO,
  Country,
  PersonNamePOJO,
} from '@shipengine/connect-sdk';
import convertISOCountryCodeToCountryEnum from './country-conversion';

const excludeNullsFromAddressLines = (
  addressLines: (string | null)[] | null | undefined
): string[] => {
  const cleanedAddress: string[] = [];
  addressLines?.forEach((line) => {
    if (line !== null && line !== '') {
      cleanedAddress.push(line);
    }
  });
  return cleanedAddress;
};

const convertResidentialIndicatorToBoolean = (
  residentialIndicator: AddressResidentialIndicator | null | undefined
): boolean | undefined => {
  if (!residentialIndicator) {
    return undefined;
  }
  return (
    residentialIndicator === AddressResidentialIndicator.Yes ||
    residentialIndicator === AddressResidentialIndicator.Residential
  );
};

const emptyDxPersonName: PersonNamePOJO = { given: '' };

const emptyDxAddress: AddressWithContactInfoPOJO = {
  addressLines: [],
  cityLocality: '',
  stateProvince: '',
  country: Country.UnitedStates,
  postalCode: '',
  email: '',
  phoneNumber: '',
  name: emptyDxPersonName,
  isResidential: undefined,
  company: '',
};

export const mapAddressToAddressWithContactInfoPOJO = (
  address: Address | null | undefined
): AddressWithContactInfoPOJO => {
  if (!address) {
    return emptyDxAddress;
  }
  const dxAddress: AddressWithContactInfoPOJO = {
    addressLines: excludeNullsFromAddressLines(address.address_lines),
    cityLocality: address.city_locality || '',
    stateProvince: address.state_province || '',
    country: convertISOCountryCodeToCountryEnum(address.country_code),
    postalCode: address.postal_code,
    email: address.email || '',
    phoneNumber: address.phone_number || '',
    name: address.name || '',
    isResidential: convertResidentialIndicatorToBoolean(
      address.address_residential_indicator || AddressResidentialIndicator.Yes
    ),
    company: address.company_name || '',
  };

  return dxAddress;
};
