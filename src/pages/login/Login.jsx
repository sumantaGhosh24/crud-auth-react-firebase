import {useContext, useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {useNavigate} from "react-router-dom";

import "./login.scss";
import {auth} from "../../firebase";
import {AuthContext} from "../../context/AuthContext";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmpty = !email || !password;

  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext);

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
    <div className="login">
      <form className="login__form" onSubmit={handleLogin}>
        <h2 className="login__heading">Login to use our application</h2>
        <input
          type="email"
          placeholder="enter your email address"
          className="login__email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="enter your password"
          className="login__password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login__btn" disabled={isEmpty}>
          Login
        </button>
        <span className="login__error"></span>
        {error && <span className="login__error">{error}</span>}
      </form>
    </div>
  );
};

export default Login;
