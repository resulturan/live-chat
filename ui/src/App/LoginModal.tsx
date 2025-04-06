import { Button, Form, Input, Modal } from "antd";
import { useLogin } from "./hooks";
import { selectIsAppInitialized, selectUser, useAppSelector } from "../store";

export default function LoginModal() {
    const isAppInitialized = useAppSelector(selectIsAppInitialized);
    const user = useAppSelector(selectUser);
    const { login, isLoading } = useLogin();

    function onUsernameChange(values: { username: string }) {
        login(values.username);
    }

    const open = !user && isAppInitialized;

    return (
        <Modal
            title="Login"
            open={open}
            footer={null}
            closable={false}
            centered
            loading={isLoading}
        >
            <Form onFinish={onUsernameChange} layout="vertical">
                <Form.Item name="username" label="Username">
                    <Input placeholder="Enter your username" autoFocus />
                </Form.Item>
                <Form.Item layout="horizontal">
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
