// src/Pages/Register.tsx
 import { useState } from "react";
import { Container, TextField, Button, Typography, Link } from "@mui/material";
import { api } from "../services/api";

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async (e:React.FormEvent) => {e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      alert("Username and password cannot be empty!");
      return;
    }
    try{
      const res = await api.register(cleanUsername,cleanPassword);
      if(!res.ok){
        const errorMessage = await res.text();
        alert(errorMessage);
        return;
      }
      alert("Registration successfull");
    window.location.href = "/login";
    }
    catch(error){
      console.error("registration failed",error)
    }
  
  };
  return(
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 3 }}>
        Register
      </Typography>

      <TextField
        label= "Username"
        fullWidth
        margin= "normal"
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button  variant="contained" fullWidth onClick={handleRegister}>
        Register
      </Button>

      
      <Typography sx={{ mt: 2, textAlign: "center" }}>
        Already have an account?{" "}
        <Link
          component="button"
          onClick={() =>(window.location.href = "/login") }
        >
          Login here
        </Link>
      </Typography>
    </Container>
  );
};

export default Register;