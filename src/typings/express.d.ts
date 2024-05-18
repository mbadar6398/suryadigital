import 'express-serve-static-core';
import { DecodedUser } from '@auth/dtos/decoded-user.dto';

declare module 'express-serve-static-core' {
  interface Request {
    user?: DecodedUser;
    isTokenExpired?: boolean;
    touchDate?: number;
    traceId?: string;
    finishedAuth?: boolean;
  }
}
