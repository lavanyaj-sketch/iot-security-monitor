import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppShell from "./components/AppShell";
import Header from "./components/Header";
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
import About from "./pages/About";
import IDEXAnalysis from "./pages/IDEXAnalysis";
import Login from "./pages/Login";
import PresentationMode from "./components/PresentationMode";
import { useAuth } from "./lib/auth";
import { Loader as Loader2 } from "lucide-react";

export default function App() {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [presenting, setPresenting] = useState(false);
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    if (presenting && isAuthRoute) setPresenting(false);
  }, [isAuthRoute, presenting]);

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <Loader2 size={32} className="spin" />
        <p>Verifying security clearance...</p>
      </div>
    );
  }

  if (!session && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  if (session && isAuthRoute) {
    return <Navigate to="/" replace />;
  }

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
      </Routes>
    );
  }

  return (
    <>
      <AppShell headerSlot={<Header onStartPresentation={() => setPresenting(true)} />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/network" element={<Network />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/federated-learning" element={<FederatedLearning />} />
          <Route path="/xai" element={<XAI />} />
          <Route path="/blockchain" element={<Blockchain />} />
          <Route path="/idex" element={<IDEXAnalysis />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppShell>
      {presenting && <PresentationMode onClose={() => setPresenting(false)} />}
    </>
  );
}
