import "@fontsource/source-sans-pro";
import { mount } from "cypress/react";
import React from "react";
import Providers from "../../src/App/Providers";
import "./commands";

Cypress.Commands.add("mount", (component, options = {}) => {
    const { ...mountOptions } = options as any;

    const wrapped = <Providers>{component}</Providers>;

    return mount(wrapped, mountOptions);
});

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}
