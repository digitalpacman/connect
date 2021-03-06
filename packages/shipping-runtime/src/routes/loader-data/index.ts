import { CarrierApp } from "@shipengine/connect-sdk/lib/internal";
import { IRouter, Router } from "express";

const router: IRouter = Router();

import { mapApp } from "../../mapping/registry-data";

router.get("/GetRegistryData", (req, res) => {
  const externalSpec = mapApp(req.app.locals.app);
  res.send(externalSpec);
});

router.get("/app", (req, res) => {
  res.send(req.app.locals.app);
});

router.get("/manifest", (req, res) => {
  const app = req.app.locals.app;
  res.send(app.manifest);
});

router.get("/appinfo", (req, res) => {
  const app = req.app.locals.app;
  const { name, description, version } = app.manifest;
  return res.json({
    packageName: name,
    description,
    version,
  });
});

router.get("/images", (req, res) => {
  const app = req.app.locals.app as CarrierApp;
  res.send([
    {
      id: app.id,
      logo: `/images/${app.id}/logo`,
      icon: `/images/${app.id}/icon`,
    },
  ]);
});
router.get("/images/:id/logo", (req, res) => {
  const app = req.app.locals.app as CarrierApp;
  res.sendFile(app.logo);
});
router.get("/images/:id/icon", (req, res) => {
  const app = req.app.locals.app as CarrierApp;
  res.sendFile(app.icon);
});

router.get("/logo", (req, res) => {
  const app = req.app.locals.app;
  res.sendFile(app.logo);
});

router.get("/icon", (req, res) => {
  const app = req.app.locals.app;
  res.sendFile(app.icon);
});
export default router;
