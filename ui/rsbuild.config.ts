import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { pluginSass } from "@rsbuild/plugin-sass";

export default defineConfig({
    plugins: [
        pluginReact(),
        pluginSvgr({
            svgrOptions: {
                exportType: "named",
            },
        }),
        pluginSass(),
    ],

    server: {
        port: 80,
        proxy: {
            "/api": { target: "http://localhost:3000" },
            "/ws": {
                target: "ws://localhost:3001",
                ws: true,
            },
        },
    },
});
