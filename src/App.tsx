import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Threats from "./pages/Threats";
import Network from "./pages/Network";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import FederatedLearning from "./pages/FederatedLearning";
import Pipeline from "./pages/Pipeline";
import XAI from "./pages/XAI";
import Blockchain from "./pages/Blockchain";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/threats" element={<Threats />} />
        <Route path="/network" element={<Network />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/federated-learning" element={<FederatedLearning />} />
        <Route path="/xai" element={<XAI />} />
        <Route path="/blockchain" element={<Blockchain />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppShell>
  );
}
