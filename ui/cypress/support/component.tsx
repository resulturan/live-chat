import "@fontsource/source-sans-pro";
import { mount } from "cypress/react";
import React from "react";
import { Provider } from "react-redux";
import Theme from "../../src/App/Theme";
import { getStore } from "../../src/store";
import "./commands";

Cypress.Commands.add("mount", (component, options = {}) => {
    const { reduxStore = getStore(), ...mountOptions } = options as any;

    const wrapped = (
        <Theme>
            <Provider store={reduxStore}>{component}</Provider>
        </Theme>
    );

    return mount(wrapped, mountOptions);
});

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}
