import { App, Button, Form, Input, Modal } from "antd";
import { useLogin } from "./hooks";
import { selectIsAppInitialized, selectUser, useAppSelector } from "../store";
import { validateUsername } from "../utils/validation";

export default function LoginModal() {
    const { notification } = App.useApp();
    const isAppInitialized = useAppSelector(selectIsAppInitialized);
    const user = useAppSelector(selectUser);
    const { login, isLoading } = useLogin();

    function onUsernameChange(values: { username: string }) {
        const validation = validateUsername(values.username);
        if (!validation.isValid) {
            notification.error({
                message: validation.error,
            });
            return;
        }
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
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: "Username is required" },
                        {
                            min: 3,
                            message:
                                "Username must be at least 3 characters long",
                        },
                        {
                            max: 20,
                            message:
                                "Username must be less than 20 characters long",
                        },
                        {
                            pattern: /^[a-zA-Z0-9_-]+$/,
                            message:
                                "Username can only contain letters, numbers, underscores, and hyphens",
                        },
                    ]}
                >
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
