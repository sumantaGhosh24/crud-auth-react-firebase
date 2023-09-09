import {useEffect, useState} from "react";
import {DriveFolderUploadOutlined} from "@mui/icons-material";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {Link, useNavigate} from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Input,
  TextField,
  Typography,
} from "@mui/material";

import {db} from "../../firebase/firebase";
import {useFirebase} from "../../firebase/AuthContext";
import {uploadImage} from "../../firebase/storage";
import {userInputs as inputs} from "../../data/formSource";

const Register = () => {
  useEffect(() => {
    document.title = "TODO - Register";
  }, []);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    country: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const firebase = useFirebase();

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        !data.username ||
        !data.name ||
        !data.email ||
        !data.phone ||
        !data.password ||
        !data.address ||
        !data.country ||
        !file.name
      ) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        const imageUrl = await uploadImage(file, "users");
        const res = await firebase.signUp(data.email, data.password);
        const obj = {...data, imageUrl};
        delete obj.password;
        await setDoc(doc(db, "users", res.user.uid), {
          ...obj,
          timestamp: serverTimestamp(),
        });
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
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 5,
      }}
    >
      <Box
        sx={{
          width: "80%",
          backgroundColor: "#fff",
          borderRadius: "7px",
          boxShadow: "6px 10px 21px -8px rgba(0,0,0,.66)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 3,
        }}
      >
        <Typography variant="h3" mt={2} sx={{marginBottom: "20px"}}>
          Register to CRUD
        </Typography>
        <div>
          <Avatar
            src={
              file
                ? URL.createObjectURL(file)
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt="avatar"
            sx={{width: 100, height: 100, marginBottom: 5}}
          />
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <label htmlFor="file">
            Profile Image{" "}
            <DriveFolderUploadOutlined sx={{display: "block", fontSize: 100}} />
          </label>
          <Input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
            sx={{display: "none"}}
          />
        </Box>
        <form onSubmit={handleRegister} style={{width: "80%"}}>
          {inputs.map((input) => (
            <Box sx={{marginBottom: 2}} key={input.id}>
              <TextField
                id={input.id}
                type={input.type}
                label={input.label}
                onChange={handleInput}
                fullWidth
              />
            </Box>
          ))}
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
            size="large"
          >
            {loading ? "Please Wait..." : "Register"}
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
            >
              {error}
            </Typography>
          )}
        </form>
        <Typography variant="body2" textAlign="center" mt={3} gutterBottom>
          Already have an account?{" "}
          <Link to="/login" style={{color: "blue"}}>
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
