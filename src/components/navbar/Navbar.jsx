import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
  Button,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";
import {PlaylistAddCheck} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {doc, onSnapshot} from "firebase/firestore";

import {db} from "../../firebase/firebase";
import {useFirebase} from "../../firebase/AuthContext";

const pages = ["Home", "Customer", "Product", "Order", "Donate"];
const linkTo = ["/", "/customers", "/products", "/orders", "/donate"];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", firebase.authUser),
      (doc) => {
        setUser(doc.data());
      }
    );
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  const handleLogout = async () => {
    try {
      await firebase.handleLogout();
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PlaylistAddCheck sx={{display: {xs: "none", md: "flex"}, mr: 1}} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: "none", md: "flex"},
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TODO
          </Typography>

          <Box sx={{flexGrow: 1, display: {xs: "flex", md: "none"}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {xs: "block", md: "none"},
              }}
            >
              {pages.map((page, i) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link to={linkTo[i]}>{page}</Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <PlaylistAddCheck sx={{display: {xs: "flex", md: "none"}, mr: 1}} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: {xs: "flex", md: "none"},
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            TODO
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
            {pages.map((page, i) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{my: 2, color: "white", display: "block"}}
              >
                <Link
                  style={{color: "white", fontWeight: "bold"}}
                  to={linkTo[i]}
                >
                  {page}
                </Link>
              </Button>
            ))}
          </Box>

          <Box sx={{flexGrow: 0}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                <Avatar alt={user?.name} src={user?.img} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{mt: "45px"}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem divider onClick={handleCloseUserMenu}>
                <Typography
                  textAlign="center"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {user?.name}
                </Typography>
              </MenuItem>
              <MenuItem divider onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography
                  textAlign="center"
                  sx={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  From: {user.country}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
