// src/Pages/Login.tsx
 import { useState } from "react";
import { Container, TextField, Button, Typography, Link } from "@mui/material";
import { api } from "../services/api";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    const res = await api.login(username, password);

    if (!res.ok) {
      alert("Invalid credentials");
      return;
    }

    const data = await res.json();

    localStorage.setItem("token",data.token);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", data.userId);

    window.location.href = "/";
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 3 }}>
        Login
      </Typography>

      <TextField
        label="Username"
        fullWidth
        margin="normal"
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button variant="contained" fullWidth onClick={handleLogin}>
        Login
      </Button>

    
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Don’t have an account?{" "}
        <Link
          component="button"
          onClick={() => (window.location.href = "/register")}
        >
          Register here
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;