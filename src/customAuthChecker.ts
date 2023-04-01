import { AuthChecker } from "type-graphql";
import { Context } from "./types";

export const customAuthChecker: AuthChecker<Context> = ({ context }, roles) => {
  const userRole = context.userData?.role;
  
  if (!userRole) {
    return false;
  }
  if (roles.includes(userRole)) {
    return true;
  }
  return false;
};
