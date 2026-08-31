import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import Chat from "./pages/chat/chat";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/resources" element={<Home />} />
                <Route path="/about" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
