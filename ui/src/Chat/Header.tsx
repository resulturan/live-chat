import { LogoutOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useLogin } from "../App/hooks";
import { selectUser, useAppSelector } from "../store";
import Styles from "./Styles.module.scss";

export default function Header() {
    const { logout } = useLogin();
    const user = useAppSelector(selectUser);

    return (
        <div className={Styles.header}>
            <Typography.Title level={1}>Live Chat</Typography.Title>

            <div className={Styles.userInfo}>
                <Typography.Text>{user?.username}</Typography.Text>

                <Button
                    type="link"
                    icon={<LogoutOutlined />}
                    onClick={logout}
                    className={Styles.logoutButton}
                    danger
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}
