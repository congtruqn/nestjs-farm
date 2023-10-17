export interface IMedicineRepository {
  findAllMedicine(): Promise<any[]>;
}
