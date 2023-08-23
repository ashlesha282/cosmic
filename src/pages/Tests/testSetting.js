import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FormControl,
  Box,
  Grid,
  Alert,
  Typography,
  Link,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm, Controller } from "react-hook-form";
import { serialize } from "object-to-formdata";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormTextField from "../../components/Common/formTextField";
import BASE_URL from "../../Utils/baseUrl";
import token from "../../Utils/token";
import CreatedBy from "../../Utils/createdBy";
import { Helmet } from "react-helmet";
import Network from "../../Utils/network";
import SidebarLeft from "../../components/Sidebar/SidebarLeft";

const StyledFormControl = styled(FormControl)({
  marginBottom: "16px",
});
const TestSetting = () => {
  const { guid } = useParams();
  var myHeaders = new Headers();
  // Get current test details
  const [test, setTest] = useState([]);
  const requestOption = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  useEffect(() => {
    const fetchTest = async () => {
      const response = await fetch(
        `${BASE_URL}/tests/view/${guid}`,
        requestOption
      );
      const testData = await response.json();
      setTest(testData && testData.payload.settings);
      reset(testData && testData.payload.settings);
    };
    fetchTest();
  }, []);
  // End
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      marks_per_question: test.marks_per_question,
      neg_marks_per_question: test.neg_marks_per_question,
      pass_marks: test.pass_marks,
      test_duration: test.test_duration,
      show_timer: test.show_timer,
      show_result: test.show_result,
      on_date: test.on_date,
      num_attempts: test.num_attempts,
    },
  });

  const { show_timer, show_result } = watch();

  const [alertOpen, setAlertOpen] = useState(false);
  const [saveSetting, setSaveSetting] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  // Authorization setup
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Network", `${Network}`);
  const handleSaveSetting = async (data) => {
    data.test_duration = data.test_duration.trim();
    const formData = serialize(data);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    try {
      const res = await fetch(
        `${BASE_URL}/tests/settings/${guid}`,
        requestOptions
      );
      const result = await res.json();
      setAlertOpen(true);
      if (result.success === true) {
        setAlertMessage("Test setting saved successfully");
        setSaveSetting(result.success);
      } else {
        setAlertMessage(
          "Invalid input value, value should be number 1,2,3,4..."
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };

  console.log(alertMessage);
  return (
    <>
      <Helmet>
        <title>Test Setting</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <SidebarLeft />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 5 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1" sx={{ fontSize: 30, fontWeight: 600 }}>
                Test Setting
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Button
                className="custom-button"
                variant="contained"
                component={Link}
                href={`/test/manage/${guid}`}
              >
                Back
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ mt: 0, width: "100%" }}
            alignItems="center"
          >
            <Grid item xs={12}>
              <Snackbar
                open={alertOpen}
                autoHideDuration={3000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert severity={saveSetting === true ? "success" : "warning"}>
                  {alertMessage}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ width: "100%" }}>
                <Grid container spacing={2} className="add-question-form">
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleSaveSetting)}>
                      <input
                        type="hidden"
                        name="created_by"
                        value={CreatedBy}
                      />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <StyledFormControl sx={{ mt: 3, width: "100%" }}>
                            <FormTextField
                              control={control}
                              label="Marks Per Quetion"
                              defaultValue="1"
                              variant="outlined"
                              name="marks_per_question"
                            />
                          </StyledFormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledFormControl sx={{ mt: 3, width: "100%" }}>
                            <FormTextField
                              control={control}
                              label="Number of attempts"
                              defaultValue="1"
                              variant="outlined"
                              name="num_attempts"
                            />
                          </StyledFormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl sx={{ mt: 3, width: "100%" }}>
                            <FormTextField
                              control={control}
                              label="Test Duration (in minutes)"
                              defaultValue="0"
                              variant="outlined"
                              pattern="[0-9]*"
                              name="test_duration"
                              required
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <StyledFormControl sx={{ mt: 3, width: "100%" }}>
                            <FormTextField
                              control={control}
                              label="Negative Marking"
                              defaultValue="1"
                              variant="outlined"
                              name="neg_marks_per_question"
                            />
                          </StyledFormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <StyledFormControl sx={{ mt: 3, width: "100%" }}>
                            <FormTextField
                              control={control}
                              label="Passing Mark"
                              defaultValue="1"
                              variant="outlined"
                              name="pass_marks"
                            />
                          </StyledFormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            component="strong"
                            sx={{ fontWeight: 700, fontSize: "20px" }}
                          >
                            Show Timer
                          </Typography>
                          <Controller
                            control={control}
                            name="show_timer"
                            defaultValue="false"
                            render={({ field: { value, onChange } }) => (
                              <RadioGroup value={value} onChange={onChange}>
                                <FormControlLabel
                                  value="true"
                                  control={
                                    <Radio
                                      onChange={({ target: { checked } }) => {
                                        setValue(
                                          "show_timer",
                                          checked ? "true" : ""
                                        );
                                      }}
                                    />
                                  }
                                  label="Yes"
                                />
                                <FormControlLabel
                                  value="false"
                                  control={
                                    <Radio
                                      onChange={({ target: { checked } }) => {
                                        setValue(
                                          "show_timer",
                                          checked ? "false" : ""
                                        );
                                      }}
                                    />
                                  }
                                  label="No"
                                />
                              </RadioGroup>
                            )}
                          />
                          {/* <RadioGroup aria-label="options" name="show_timer">
                            <FormControlLabel
                              value="true"
                              control={
                                <Radio
                                  onChange={({ target: { checked } }) => {
                                    setValue(
                                      "show_timer",
                                      checked ? "true" : "false"
                                    );
                                  }}
                                />
                              }
                              label="Yes"
                            />
                            <FormControlLabel
                              value="false"
                              control={
                                <Radio
                                  onChange={({ target: { checked } }) => {
                                    setValue(
                                      "show_timer",
                                      checked ? "false" : "true"
                                    );
                                  }}
                                />
                              }
                              label="No"
                            />
                          </RadioGroup> */}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            component="strong"
                            sx={{ fontWeight: 700, fontSize: "20px" }}
                          >
                            Show Result
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Controller
                            control={control}
                            name="show_result"
                            defaultValue="none"
                            render={({ field: { value, onChange } }) => (
                              <RadioGroup value={value} onChange={onChange}>
                                <FormControlLabel
                                  value="immediately"
                                  control={
                                    <Radio
                                      onChange={({ target: { checked } }) => {
                                        setValue(
                                          "show_result",
                                          checked ? "immediately" : ""
                                        );
                                        setValue("on_date", "");
                                      }}
                                    />
                                  }
                                  label="Immediately after test submissions"
                                />
                                <FormControlLabel
                                  value="manually"
                                  control={
                                    <Radio
                                      onChange={({ target: { checked } }) => {
                                        setValue(
                                          "show_result",
                                          checked ? "manually" : ""
                                        );
                                        setValue("on_date", "");
                                      }}
                                    />
                                  }
                                  label="Manually at a later date"
                                />
                                <FormControlLabel
                                  style={{ width: "100%" }}
                                  value="on_date"
                                  control={<Radio />}
                                  label={
                                    <div
                                      style={{ display: "flex", width: "100%" }}
                                    >
                                      <span style={{ minWidth: "max-content" }}>
                                        On Date:
                                      </span>
                                      <DatePicker
                                        className="on-time-date"
                                        selected={
                                          value === "on_date"
                                            ? watch("on_date")
                                              ? new Date(watch("on_date"))
                                              : null
                                            : null
                                        }
                                        onChange={(date) => {
                                          setValue("on_date", date);
                                        }}
                                        disabled={value !== "on_date"}
                                        dateFormat="dd/MM/yyyy"
                                      />
                                    </div>
                                  }
                                />
                                {/* Display error message if needed */}
                              </RadioGroup>
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Button
                        variant="outlined"
                        type="submit"
                        className="custom-button"
                      >
                        Save Setting
                      </Button>
                    </form>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TestSetting;
