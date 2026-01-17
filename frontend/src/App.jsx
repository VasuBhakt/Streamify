import { Camera, Search } from "lucide-react";
import Button from "./components/button/Button";
import Input from "./components/input/Input";
import Container from "./components/container/Container";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
    return (
        <div className="flex bg-background min-h-screen text-text-main">
            <Sidebar />

            <main className="flex-1">
                <Container>
                    <Button icon={Camera} label="Create" />
                    <Input placeholder="Search" icon={Search} />
                </Container>
            </main>
        </div>
    )
}

export default App;
