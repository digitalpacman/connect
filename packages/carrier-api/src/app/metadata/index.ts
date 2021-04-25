export interface CarrierDefinition {
  Id: string;
  Alias: string;
  Name: string;
  Description: string;
  CarrierUrl: string;
  Tags: string;
  LabelFormats: string;
}

/** @description This represents a single integration which may contain multiple branded order sources */
export interface CarrierAppMetadata {
  /** @description The id for this integration */
  Id: string;
  /** @description The name of this integration */
  Name: string;
  /** @description A list of branded order sources associated with this integration */
  Carriers: CarrierDefinition[];
}

