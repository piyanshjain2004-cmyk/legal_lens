import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Chat from "./pages/chat/chat";
import Resources from "./pages/resources/resources";
import About from "./pages/about/about";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
