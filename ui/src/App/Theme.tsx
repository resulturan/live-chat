import { ConfigProvider, ThemeConfig } from "antd";
import React from "react";

export default function Theme({ children }: ThemeProps) {
    return <ConfigProvider theme={config}>{children}</ConfigProvider>;
}

const config: ThemeConfig = {
    token: {
        fontFamily: "Source Sans Pro",
    },
};

interface ThemeProps {
    children: React.ReactNode;
}
