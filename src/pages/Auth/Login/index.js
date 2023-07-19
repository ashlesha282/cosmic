import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { serialize } from "object-to-formdata";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Snackbar,
  Typography,
  Grid,
  Button,
  Alert,
  Link,
} from "@mui/material";
import illustartion from "../../../assets/images/Illustration.png";
import BASE_URL from "../../../Utils/baseUrl";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      device_name: "device",
    },
  });
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const [isUserloggedIn, setIsUserloggedIn] = useState(null);

  const submitLoginForm = async (data) => {
    try {
      const formData = serialize(data);
      const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };
      const response = await fetch(
        `${BASE_URL}/auth/login`,
        requestOptions
      );
      const result = await response.json();
      setOpen(true)
      if (result.success === true) {
        localStorage.setItem('token', result.payload.token);
        setToken(data.token);
        setIsUserloggedIn(true);
        setTimeout(() => {
          navigate(`/`);
        }, 3000);
      } else {
        setIsUserloggedIn(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsUserloggedIn(false);
    }
  };

  return (
    <>
      <Grid
        container
        maxWidth={600}
        sx={{ mx: "auto", justifyContent: "center" }}
        className={`login-page`}
      >
        <Grid
          item
          sx={{
            padding: "15px",
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img alt="Login" style={{ maxWidth: 200 }} src={illustartion} />
          <Typography component="h1" variant="h5" sx={{ my: 2 }}>
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(submitLoginForm)}>
            <TextField
              margin="normal"
              fullWidth
              label="Email/Username/Mobile No"
              {...register("username", { required: true })}
              helperText={errors.username && "Username is required"}
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              {...register("password", { required: true })}
              helperText={errors.password && "Password is required"}
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <Grid container>
              <Grid item xs>
                <Link href="/auth/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </form>
          <Grid container sx={{ justifyContent: "center", mb:3 }}>
            <Grid item>
              <Link href="/auth/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={isUserloggedIn === true ? "success" : "warning"}>
            {isUserloggedIn === true ? "Login Successfull" : "Login Failed"}
          </Alert>
        </Snackbar>
      </Grid>
    </>
  );
}
