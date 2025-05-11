import { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import BuildingForm from "../components/BuildingForm";
import Dashboard from "../components/Dashboard";

function AllRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<BuildingForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default AllRoutes;
