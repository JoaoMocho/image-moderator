import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Reports from "./pages/Reports/Reports";
import Archive from "./pages/Archive/Archive";
import NewReport from "./pages/NewReport/NewReport";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/"} element={<Navbar />}>
          <Route path={"reports/"} element={<Reports />} />
          <Route path={"archive/"} element={<Archive />} />
          <Route path={"new/"} element={<NewReport />} />
        </Route>
        <Route path={"*"} element={<Navigate to={"/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
