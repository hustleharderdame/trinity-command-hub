import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import TitleScreen from "@/components/TitleScreen";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  if (!isAuthenticated) {
    return (
      <TitleScreen
        onStart={() => {
          window.location.href = getLoginUrl();
        }}
        onSettings={() => {
          // Settings handler
        }}
        onAbout={() => {
          // About handler
        }}
      />
    );
  }

  return <Dashboard />;
}
