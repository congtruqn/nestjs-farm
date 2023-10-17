export class PregnancyTestEventModel {
  id: number;
  createdBy: string;
  eventDate: Date;
  eventDefine: string;
  block: string;
  room: string;
  house: string;
  serviceFailedDate: Date;
  serviceFailedMethod: number;
  reason: string;
  personInCharge: string;
  stig: string;
  tattoo: string;
  herdStat: string;
  pigStatus: string;
  comment: string;
  comment1: string;
  comment2: string;
  eventStatus: string;
  abortedDate: Date;
  constructor(partial: Partial<PregnancyTestEventModel>) {
    Object.assign(this, partial);
  }
}
