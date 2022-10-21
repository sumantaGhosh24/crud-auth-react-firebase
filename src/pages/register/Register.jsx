import {useEffect, useState} from "react";
import {DriveFolderUploadOutlined} from "@mui/icons-material";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
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

import {auth, db, storage} from "../../firebase";
import {userInputs as inputs} from "../../formSource";

const Register = () => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [per, setPer] = useState(null);

  const navigate = useNavigate();

  const isEmpty =
    !data.username ||
    !data.displayName ||
    !data.email ||
    !data.phone ||
    !data.password ||
    !data.address ||
    !data.country;

  useEffect(() => {
    document.title = "TODO - Register";
  }, []);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      console.log("file name", name);

      const storageRef = ref(storage, name);
      console.log("storage ref", storageRef);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
          setPer(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          setError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({...prev, img: downloadURL}));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleInput = (e) => {
    const {id, value} = e.target;
    setData({...data, [id]: value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const obj = {...data};
      delete obj.password;
      await setDoc(doc(db, "users", res.user.uid), {
        ...obj,
        timestamp: serverTimestamp(),
      });
      navigate("/login");
    } catch (error) {
      setError(error.message);
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
            disabled={per !== null && per < 100}
            variant="contained"
            color="primary"
            size="large"
          >
            Register
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
