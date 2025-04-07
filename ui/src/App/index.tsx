import Chat from "../Chat";
import LoginModal from "./LoginModal";
import Providers from "./Providers";

export default function App() {
    return (
        <Providers>
            <Chat />
            <LoginModal />
        </Providers>
    );
}
