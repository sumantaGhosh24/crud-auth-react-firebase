import {useEffect} from "react";
import {Box, Button, Container, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import {ArrowBack} from "@mui/icons-material";

const NotFound = () => {
  useEffect(() => {
    document.title = "TODO - Page Not Found";
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: "500px",
          width: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h2"
          textAlign="center"
          sx={{textTransform: "capitalize", marginBottom: 10}}
        >
          404 || page not found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ArrowBack />}
        >
          <Link to="/" style={{color: "#fff"}}>
            Back to Home
          </Link>
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
