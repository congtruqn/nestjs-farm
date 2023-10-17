export class ChooseGiltTicketModel {
  id: number;
  ticketId: string;
  choiseNumber: number;
  rejectNumber: number;
  eventDate: Date;
  peronInCharge: string;
  createdBy: string;
  constructor(partial: Partial<ChooseGiltTicketModel>) {
    Object.assign(this, partial);
  }
}

export class NeedChooseGiltsModel {
  id: number;
  tattoo: string;
  geneticName: string;
  groupName: string;
  pigNumber: number;
  herdStat: string;
  dam: string;
  sire: string;
  pic: number;
  weekAge: number;
  house: string;
  block: string;
  room: string;
  peronInCharge: string;
  createdBy: string;
  pigletGroupCode: string;
  pigStatus: string;
  constructor(partial: Partial<NeedChooseGiltsModel>) {
    Object.assign(this, partial);
  }
}

export class ChooseGiltEventModel {
  eventId: number;
  tattoo: string;
  stig: string;
  personInCharge: string;
  pic: number;
  geneticName: string;
  herdStat: string;
  sbEndDate: Date;
  selectedBreed: number;
  disposalReason: string;
  pigletGroupCode: string;
  constructor(partial: Partial<ChooseGiltEventModel>) {
    Object.assign(this, partial);
  }
}

export class EventModel {
  eventId: number;
  ticketId: number;
  createdBy: string;
  eventDate: Date;
  eventDefine: string;
  medicineName: string;
  diseaseName: string;
  medicineExpiry: Date;
  medicineLot: string;
  block: string;
  room: string;
  house: string;
  exportId: string;
  constructor(partial: Partial<EventModel>) {
    Object.assign(this, partial);
  }
}

export class HasChooseGiltPigsModel {
  id: number;
  tattoo: string;
  stig: string;
  pigletGroupCode: string;
  geneticName: string;
  groupName: string;
  herdStat: string;
  dam: string;
  sire: string;
  pic: number;
  weekAge: number;
  house: string;
  block: string;
  room: string;
  personInCharge: string;
  createdBy: string;
  pigStatus: string;
  sbEndDate: Date;
  eventDate: Date;
  eventId: number;
  constructor(partial: Partial<HasChooseGiltPigsModel>) {
    Object.assign(this, partial);
  }
}

export class ExportChooseGiltsModel {
  id: number;
  tattoo: string;
  gender: number;
  constructor(partial: Partial<ExportChooseGiltsModel>) {
    Object.assign(this, partial);
  }
}
