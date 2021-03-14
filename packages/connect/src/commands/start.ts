import BaseCommand from "../base-command";
import { ApiClientErrors } from '../core/api-client'
import { loadApp } from "@shipengine/connect-loader";
import { spawn } from 'child_process';
import { promisify } from 'util';

export default class Start extends BaseCommand {
  public static description = "Start the app";

  async run(): Promise<void> {
    const { flags } = this.parse(Start);

    try {
      const app = await loadApp(process.cwd())
      let runtime;
      if (app.type === 'order') {
        runtime = require.resolve('@shipengine/connect-order-source-runtime')
      } else {
        runtime = require.resolve('@shipengine/connect-shipping-runtime')
      }
      spawn('node', [runtime], {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: {
          ...process.env,
          DX_APP_PATH: process.cwd()
        }
      });
    } catch (error) {
      switch (error.code) {
        case "ERR_APP_ERROR":
          return this.error("Error loading your app - please make sure you are in an app directory", {
            exit: 1,
          });
        case ApiClientErrors.NotFound:
          return this.error("This app has not been published yet", {
            exit: 1,
          });
        default:
          return this.error(error, {
            exit: 1,
          });
      }
    }
  }
}
