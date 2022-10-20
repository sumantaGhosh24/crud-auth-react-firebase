import {useContext, useEffect, useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import {Box, Button, Container, TextField, Typography} from "@mui/material";

import {auth} from "../../firebase";
import {AuthContext} from "../../context/AuthContext";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmpty = !email || !password;

  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext);

  useEffect(() => {
    document.title = "TODO - Login";
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("userCredential", userCredential);
        const user = userCredential.user;
        dispatch({type: "LOGIN", payload: user});
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
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
            disabled={isEmpty}
            variant="contained"
            color="primary"
            size="large"
          >
            Login
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
