import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Box, Button, Container, TextField, Typography} from "@mui/material";

import {useFirebase} from "../../firebase/AuthContext";

const Login = () => {
  useEffect(() => {
    document.title = "TODO - Login";
  }, []);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const firebase = useFirebase();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!email || !password) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        await firebase.signIn(email, password);
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 600,
          height: 500,
          backgroundColor: "#fff",
          borderRadius: "7px",
          boxShadow: "6px 10px 21px -8px rgba(0,0,0,0.66)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h3" mt={2} sx={{marginBottom: "20px"}}>
          Login to CRUD
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{marginTop: "25px", marginBottom: "25px"}}
          />
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
            size="large"
          >
            {loading ? "Please Wait..." : "Login"}
          </Button>
          {error && (
            <Typography
              variant="h6"
              textAlign="center"
              mt={3}
              sx={{
                color: "red",
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
              gutterBottom
            >
              {error}
            </Typography>
          )}
        </form>
        <Typography variant="body1" textAlign="center" mt={3} gutterBottom>
          Don't have an account?{" "}
          <Link to="/register" style={{color: "blue"}}>
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
