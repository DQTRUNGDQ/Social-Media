import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import useAuthToken from "./services/useAuthToken";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const QueryClientInstance = new QueryClient();

function App() {
  const { accessToken, setAccessToken } = useAuthToken();
  useEffect(() => {
    // Gửi accessToken cùng với mỗi request
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  return (
    <QueryClientProvider client={QueryClientInstance}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
