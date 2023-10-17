export class ListSerialTreatmentModel {
  id: number;
  ticketId: string;
  eventDate: string;
  diseaseName: string;
  block: string;
  room: string;
  house: string;
  eventStatusName: string;
  employee: string;
  medicineName: string;
  constructor(partial: Partial<ListSerialTreatmentModel>) {
    Object.assign(this, partial);
  }
}

export class DetailTreatmentModel {
  id: number;
  ticketId: string;
  eventDate: string;
  diseaseName: string;
  block: string;
  blockId: number;
  room: string;
  roomId: number;
  house: string;
  houseId: number;
  eventStatusName: string;
  personInCharge: string;
  medicineName: string;
  medicineLot: string;
  medicineExpiry: string;
  exportId: string;
  eventStatus: string;
  herdStat: string;
  tattoo: string;
  stig: string;
  quantity: number;
  dob: Date;
  geneticName: string;
  createdBy: string;
  updatedBy: string;
  constructor(partial: Partial<DetailTreatmentModel>) {
    Object.assign(this, partial);
  }
}
export class ChooseGiltTicket {
  id: number;
  ticketId: string;
  eventDate: string;
  createdBy: string;
  constructor(partial: Partial<ChooseGiltTicket>) {
    Object.assign(this, partial);
  }
}
