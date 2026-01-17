import { Camera, Search } from "lucide-react";
import Button from "./components/button/Button";
import Input from "./components/input/Input";
import Container from "./components/container/Container";

function App() {
    return (
        <>
            <Container>
                <Input label="Search" placeholder="Your videos..." icon={Search} type="number" />
                <Button label="Button" variant="secondary" className="bg-green-700 hover:bg-green-600 " size="lg" type="submit" icon={Camera} />
            </Container>
        </>
    )
}

export default App;
