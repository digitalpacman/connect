"use strict";

const { loadApp } = require("../../lib");
const { expect } = require("chai");
const path = require("path");
let jsonConfig;

describe("loadApp() should load a typescript file that also references a .ts file path", () => {

  beforeEach(async () => {
    const relativePath = "../fixtures/integration-apps/carrier-typescript-app";
    const appPath = path.join(__dirname, relativePath);
    jsonConfig = await loadApp(appPath);
  });

  it("should properly dereference a config file that has dynamic imports", () => {
    expect(jsonConfig.id).to.be.a("string");
    expect(jsonConfig.name).to.equal("My Carrier");
    expect(jsonConfig.description).to.equal("My Carrier description goes here");
    expect(jsonConfig.websiteURL.href).to.equal("https://www.my-carrier.com/");
    expect(jsonConfig.logo.colorSVG).to.be.a("string");
    expect(jsonConfig.logo.colorSVG).to.be.contain("<svg");

    expect(jsonConfig.logo.blackAndWhiteSVG).to.be.a("string");
    expect(jsonConfig.logo.blackAndWhiteSVG).to.be.contain("<svg");

    expect(jsonConfig.deliveryServices).to.be.an("array");
    expect(jsonConfig.deliveryServices).to.be.an("array").with.lengthOf(1);
    expect(jsonConfig.deliveryServices[0].name).to.equal("Ground");
    expect(jsonConfig.deliveryServices[0].packaging[0].name).to.equal("Flat-Rate Box");
    expect(jsonConfig.deliveryServices[0].packaging[1].name).to.equal("Large Padded Envelope");


    expect(jsonConfig.pickupServices).to.be.an("array");
    expect(jsonConfig.pickupServices).to.be.an("array").with.lengthOf(2);
    expect(jsonConfig.pickupServices[0].name).to.equal("Drop Off Pickup");
    expect(jsonConfig.pickupServices[1].name).to.equal("One Time Pickup");

    expect(jsonConfig.loginForm).to.be.an("object");
    expect(jsonConfig.loginForm.dataSchema.title).to.equal("Carrier One Registration");

    expect(jsonConfig.settingsForm).to.be.an("object");
    expect(jsonConfig.settingsForm.dataSchema.title).to.equal("Carrier One Settings");

    expect(jsonConfig.login).to.be.a("function");
    expect(jsonConfig.requestPickup).to.be.a("function");
    expect(jsonConfig.cancelPickup).to.be.a("function");
    expect(jsonConfig.createLabel).to.be.a("function");
    expect(jsonConfig.voidLabel).to.be.a("function");
    expect(jsonConfig.getRates).to.be.a("function");
    expect(jsonConfig.getTrackingUrl).to.be.a("function");
    expect(jsonConfig.track).to.be.a("function");
    expect(jsonConfig.createManifest).to.be.a("function");
  });

});
