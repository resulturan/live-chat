import { Button, Result } from "antd";

export default function Falback({ error, resetErrorBoundary }: Props) {
    return (
        <Result
            status="error"
            title="Something went wrong"
            subTitle={error.message}
            extra={
                <Button type="primary" onClick={resetErrorBoundary}>
                    Try again
                </Button>
            }
        />
    );
}

interface Props {
    error: Error;
    resetErrorBoundary: () => void;
}
