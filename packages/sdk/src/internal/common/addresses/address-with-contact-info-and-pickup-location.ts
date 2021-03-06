import { AddressWithContactInfoAndPickupLocation as IAddressWithContactInfoAndPickupLocation, AddressWithContactInfoAndPickupLocationPOJO } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Address, AddressBase } from "./address";
import { ContactInfo } from "./contact-info";
import { PersonName } from "./person-name";
import { PickupLocation } from "./pickup-location";

export class AddressWithContactInfoAndPickupLocation extends AddressBase implements IAddressWithContactInfoAndPickupLocation {
  public static readonly [_internal] = {
    label: "address",
    schema: Address[_internal].schema.concat(ContactInfo[_internal].schema),
  };

  public readonly name: PersonName;
  public readonly email: string;
  public readonly phoneNumber: string;
  public readonly pickupLocation?: PickupLocation;

  public constructor(pojo: AddressWithContactInfoAndPickupLocationPOJO) {
    super(pojo);

    this.name = new PersonName(pojo.name);
    this.email = pojo.email || "";
    this.phoneNumber = pojo.phoneNumber || "";
    this.pickupLocation = pojo.pickupLocation ? new PickupLocation(pojo.pickupLocation) : undefined;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
