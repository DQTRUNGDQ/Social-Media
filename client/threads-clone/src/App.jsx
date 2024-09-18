import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import useAuthToken from "./services/useAuthToken";
import axios from "axios";

function App() {
  const { accessToken, setAccessToken } = useAuthToken();
  useEffect(() => {
    // Gửi accessToken cùng với mỗi request
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
  }, [accessToken]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
