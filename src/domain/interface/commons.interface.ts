export interface IUserAuth {
  ID: string;
  UserID: string;
  UserName: string;
  FullName: string;
  FarmID: number;
  IndustryCode: string;
  Email: string;
  Phone: string;
  EmpNo: string;
  UserType: string;
  RoleCode: string;
}

export interface IHeader {
  CorrelationID: string;
  UserAuth: IUserAuth;
}
