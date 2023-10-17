import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    if (process.env.ENV == 'LOCAL') {
      const token = req.headers['authorization']
        ? req.headers['authorization']
        : null;
      if (token) {
        const base64Payload = token.split('.')[1];
        if (!base64Payload) return {};
        const payloadBuffer = Buffer.from(base64Payload, 'base64');
        const updatedJwtPayload = JSON.parse(payloadBuffer.toString());
        return updatedJwtPayload;
      }
      //throw new BadRequestException('AUTH_USER_NOT_FOUND');
      return {};
    } else {
      const userAuth = req.headers['userauth'];
      if (userAuth) {
        const userInfo = JSON.parse(userAuth);
        return {
          userInfo: {
            id: userInfo.ID,
            username: userInfo.UserName,
            fullName: userInfo.FullName,
            email: userInfo.Email,
            phone: userInfo.Phone,
            empNo: userInfo.EmpNo,
            userType: userInfo.UserType,
            industryCode: userInfo.IndustryCode,
            roleCode: userInfo.RoleCode,
            userId: userInfo.UserID,
            farmId: userInfo.FarmID,
          },
        };
      }
      return {};
    }
  },
);

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
