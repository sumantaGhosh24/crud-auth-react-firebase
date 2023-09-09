import {useEffect, useState} from "react";
import {ArrowBack, DriveFolderUploadOutlined} from "@mui/icons-material";
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
import {v4 as uuidv4} from "uuid";

import {db} from "../../firebase/firebase";
import {Navbar} from "../../components";
import {useFirebase} from "../../firebase/AuthContext";
import {uploadImage} from "../../firebase/storage";

const CustomerNew = ({inputs}) => {
  useEffect(() => {
    document.title = "TODO - New Customer";
  }, []);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
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

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const customerId = uuidv4();
    try {
      setLoading(true);
      if (
        !data.username ||
        !data.name ||
        !data.email ||
        !data.phone ||
        !data.address ||
        !data.country ||
        !file.name
      ) {
        setLoading(false);
        setError("Please fill all the fields.");
      } else {
        setError(null);
        const img = await uploadImage(file, "customers");
        await setDoc(
          doc(db, "users", firebase.authUser, "customers", customerId),
          {
            ...data,
            img,
            timestamp: serverTimestamp(),
          }
        );
        setLoading(false);
        navigate("/customers");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBack />}
        sx={{marginBottom: 5, marginLeft: 5, marginTop: 5}}
      >
        <Link to="/customers" style={{color: "#fff"}}>
          Go Back
        </Link>
      </Button>
      <Container
        maxWidth="xl"
        sx={{
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
            boxShadow: "6px 10px 21px -8px rgba(0, 0, 0, 0.66)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: 5,
          }}
        >
          <Typography variant="h3" mt={2} sx={{marginBottom: "20px"}}>
            Create New Customer
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
              <DriveFolderUploadOutlined
                sx={{display: "block", fontSize: 100}}
              />
            </label>
            <Input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              sx={{display: "none"}}
            />
          </Box>
          <form onSubmit={handleAddCustomer} style={{width: "80%"}}>
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
              {loading ? "Please Wait..." : "Add Customer"}
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
        </Box>
      </Container>
    </>
  );
};

export default CustomerNew;
