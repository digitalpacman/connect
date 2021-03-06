import { IRouter, Router } from "express";
import redoc from "redoc-express";
import { App } from "../app";

export default function docs(app: App): IRouter {
  const router: IRouter = Router();

  if (!app.redoc) {
    return router;
  }

  router.get("/docs/spec.yaml", (req, res) => {
    res.send(app.redoc);
  });

  router.get(
    "/docs",
    redoc({
      title: "API Docs",
      specUrl: "/docs/spec.yaml",
    })
  );

  return router;
}
