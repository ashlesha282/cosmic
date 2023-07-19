import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Button,
  Alert,
  FormControl,
  Link,
  Snackbar,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import Sidebar from "../../components/Sidebar/Sidebar";
import BASE_URL from "../../Utils/baseUrl";
import CreatedBy from "../../Utils/createdBy";
import token from "../../Utils/token";
import Network from "../../Utils/network";
import FormEditorField from "../../components/Common/formEditorField";
import { serialize } from "object-to-formdata";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});

const CreateMeeting = () => {
  // state initialization
  const [isMeetingCreated, setIsMeetingCreated] = useState(null);
  const [alertOpen, setAlertOpen] = useState(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      created_by: CreatedBy,
      details: "",
    },
  });
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);

  const navigate = useNavigate();
  const handleFormSubmit = async (data) => {
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    const content = editorRef.current.getContent();
    if (content.trim() === "") {
      alert("Meeting details field should not be empty!");
    } else {
      try {
        const response = await fetch(`${BASE_URL}/zoom/create`, requestOptions);
        const result = await response.json();
        setAlertOpen(true)
        if (result.success === true) {
          setIsMeetingCreated(true);
          setTimeout(() => {
            navigate(`/online-classes`);
          }, 3000);
        } else {
          setIsMeetingCreated(false);
        }
      } catch (error) {
        setIsMeetingCreated(false);
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>Create Meeting</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ width: "100%" }}
            alignItems="center"
          >
            <Grid item>
            <Snackbar
            open={alertOpen}
            autoHideDuration={3000}
            onClose={() => setIsMeetingCreated(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity={isMeetingCreated === true ? "success" : "warning"}>
              {isMeetingCreated === true
                ? "Meeting created Successfully"
                : "Meeting creation failed"}
            </Alert>
          </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Create Meeting
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button variant="contained">
                <Link href="/online-classes" color="inherit" underline="none">
                  Cancel
                </Link>
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <StyledFormControl sx={{ width: "100%" }}>
                  <label
                    htmlFor="details"
                    style={{
                      fontSize: 20,
                      fontWeight: 500,
                      fontFamily: "Arial",
                      marginBottom: "10px",
                    }}
                  >
                    Meeting Details
                  </label>
                  <FormEditorField
                    control={control}
                    name="details"
                    onInit={(evt, editor) => (editorRef.current = editor)}
                  />
                </StyledFormControl>

                <Button variant="contained" type="submit">
                  Save Meeting
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default CreateMeeting;
