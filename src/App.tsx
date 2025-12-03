import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Submit from "./pages/Submit";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Submit />} />
          <Route path="submit" element={<Submit />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
