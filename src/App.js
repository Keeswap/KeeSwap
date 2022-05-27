import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./Main";
import Vesting from "./Pages/Vesting";

export default function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/keeswap/admin_/test/vesting" element={<Vesting />} />
      </Routes>
    </>
  );
}
