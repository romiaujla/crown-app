import { Router } from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

export const authorizationRouter = Router();

authorizationRouter.get("/platform/ping", authenticate, authorize({ namespace: "platform" }), (_req, res) => {
  res.status(200).json({ ok: true, namespace: "platform" });
});

authorizationRouter.get(
  "/tenant/admin/:tenantId",
  authenticate,
  authorize({ namespace: "tenant", allowedRoles: ["tenant_admin"] }),
  (_req, res) => {
    res.status(200).json({ ok: true, namespace: "tenant-admin" });
  }
);

authorizationRouter.get(
  "/tenant/user/:tenantId",
  authenticate,
  authorize({ namespace: "tenant", allowedRoles: ["tenant_admin", "tenant_user"] }),
  (_req, res) => {
    res.status(200).json({ ok: true, namespace: "tenant-user" });
  }
);
