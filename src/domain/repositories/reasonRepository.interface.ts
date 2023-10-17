export interface IReasonRepository {
  findAllReason(): Promise<any[]>;
  getPregnancyTestReason(): Promise<any[]>;
}
