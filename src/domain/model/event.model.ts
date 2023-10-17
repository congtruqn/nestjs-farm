export class EventModel {
  id: number;

  code: string;

  name: string;

  description: string;

  isActive: boolean;

  groupId: number;

  eventTicketId: number;

  eventDefineId: number;

  constructor(partial: Partial<EventModel>) {
    Object.assign(this, partial);
  }
}
