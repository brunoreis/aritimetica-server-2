
import { AuthChecker } from "type-graphql";
import { Context } from "./types";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "./env";

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  const authorization = context.req.headers["authorization"];
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
      // If roles are specified, check if the user has the required role
      if (roles.length > 0) {
        return roles.includes((decodedToken as any).role);
      }
      return true;
    } catch (err) {
      throw new Error("Invalid token");
    }
  } else {
    throw new Error("Authentication required");
  }
};
