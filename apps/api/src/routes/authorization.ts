import { Router } from "express";

import { RoleEnum } from "../auth/claims.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

export const authorizationRouter = Router();

authorizationRouter.get("/platform/ping", authenticate, authorize({ namespace: "platform" }), (_req, res) => {
  res.status(200).json({ ok: true, namespace: "platform" });
});

authorizationRouter.get(
  "/tenant/admin/:tenantId",
  authenticate,
  authorize({ namespace: "tenant", allowedRoles: [RoleEnum.TENANT_ADMIN] }),
  (_req, res) => {
    res.status(200).json({ ok: true, namespace: "tenant-admin" });
  }
);

authorizationRouter.get(
  "/tenant/user/:tenantId",
  authenticate,
  authorize({ namespace: "tenant", allowedRoles: [RoleEnum.TENANT_ADMIN, RoleEnum.TENANT_USER] }),
  (_req, res) => {
    res.status(200).json({ ok: true, namespace: "tenant-user" });
  }
);
