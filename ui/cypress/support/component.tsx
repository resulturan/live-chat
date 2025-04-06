import "./commands";
import React from "react";
import { mount } from "cypress/react";
import { Provider } from "react-redux";
import { getStore } from "../../src/store";

Cypress.Commands.add("mount", (component, options = {}) => {
    const { reduxStore = getStore(), ...mountOptions } = options as any;

    const wrapped = <Provider store={reduxStore}>{component}</Provider>;

    return mount(wrapped, mountOptions);
});

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}
