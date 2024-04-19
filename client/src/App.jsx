import RenderForm from "./components/login";
import NewPage from "./components/NewPage";
import SignupForm from "./components/Signup"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrevScores from "./components/PrevScores";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewPage/>}></Route>
        <Route path="/score" element={<PrevScores/>}></Route>

      </Routes>
    </BrowserRouter>

      );

}

export default App
