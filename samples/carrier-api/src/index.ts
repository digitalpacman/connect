import { CarrierApp } from '@shipengine/connect-carrier-api';
import {
  Register,
  GetRates,
  CreateLabel,
  VoidLabels,
  CreateManifest,
  SchedulePickup,
  CancelPickup,
  Track
} from './methods';

export default new CarrierApp({
  Register,
  GetRates,
  CreateLabel,
  VoidLabels,
  CreateManifest,
  SchedulePickup,
  CancelPickup,
  Track
})
