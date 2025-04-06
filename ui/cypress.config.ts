import { defineConfig } from "cypress";
import { devServer } from "cypress-rspack-dev-server";
import config from "./rsbuild.config.ts";
import { createRsbuild } from "@rsbuild/core";

export default defineConfig({
    component: {
        supportFile: "./cypress/support/component.tsx",
        async devServer(devServerConfig) {
            const rsbuild = await createRsbuild({ rsbuildConfig: config });
            const rsbuildConfigs = await rsbuild.initConfigs();

            const rspackConfig = rsbuildConfigs[0];

            rspackConfig?.module?.rules?.push({
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: ["istanbul"],
                    },
                },
                enforce: "post",
            });
            return devServer({
                ...devServerConfig,
                framework: "react",
                rspackConfig: rspackConfig,
            });
        },
    },
});
