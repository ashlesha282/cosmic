import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  Grid,
  Button,
  InputLabel,
  Link,
  Input,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import BASE_URL from '../../../Utils/baseUrl';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import CreatedBy from '../../../Utils/createdBy';
import { serialize } from 'object-to-formdata';
import FormTextField from '../../../components/Common/formTextField';
import FormEditorField from '../../../components/Common/formEditorField';
import SidebarLeft from '../../../components/Sidebar/SidebarLeft';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const CreateSubject = () => {
  const { courseGuid } = useParams();
  const [alertOpen, setAlertOpen] = useState(null);
  const [isCourseCreated, setIsCourseCreated] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [valueLength, setValueLength] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isTextareaValid, setTextareaValid] = useState(false);
  const [isInputValid, setInputValid] = useState(true);
  const [valueStep1, setValueStep1] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [maxCharacterError, setMaxCharacterError] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: '0',
      created_by: CreatedBy,
      userfile: undefined,
    },
  });
  // const filename = watch('userfile');
  const { title, description, userfile } = watch();
  // image Upload file

  const [file, setFile] = useState(null);
  // const [fileError, setFileError] = useState('');
  const [filename, setFilename] = useState(null);

  const handleFileChange = (e) => {
    const [selectedFile] = e.target.files;

    if (selectedFile) {
      // Check if the file size exceeds 300MB (adjust the size limit as needed)
      if (selectedFile.size > 300 * 1024 * 1024) {
        setFileError('File size should be less than 300MB.');
        setFilename(null); // Clear the filename if the file is invalid
      } else {
        setFileError(''); // Clear any previous error
        setFilename(selectedFile.name);
        setValue('userfile', selectedFile);
      }
    }
  };

  // image Upload file

  // Authentication
  var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);

  const handleFormSubmit = async (data) => {
    const formdata = new FormData();
    formdata.append('title', data.title);
    formdata.append('description', data.description);
    formdata.append('userfile', userfile);
    console.log(formdata);
  };
  const handleInputChange = (event) => {
    const newValue = event.target.value;

    // Truncate the input text if it exceeds 35 characters
    const truncatedValue = newValue.slice(0, 35);

    setInputValue(truncatedValue);
    setValue('title', truncatedValue);
    setValueLength(truncatedValue.length);

    // Validation for title length (between 3 and 35 characters)
    const isValid = truncatedValue.length >= 3 && truncatedValue.length <= 35;
    setInputValid(isValid);

    // Show error message for length == 35
    if (truncatedValue.length === 35) {
      setInputValid(false);
    }
  };

  const handleTextareaChange = (content) => {
    // Check if the content length is greater than or equal to 100
    if (content.length >= 100) {
      // Disable typing by truncating the content to 100 characters
      content = content.slice(0, 100);
      setTextareaValue(content);
      setValue('description', content);
      setTextareaValid(true); // Mark as valid

      // Display an error message
      setMaxCharacterError(true);
    } else {
      // Content is within the limit
      setTextareaValue(content);
      setValue('description', content);
      setTextareaValid(content.length === 0 || content.length >= 100); // Validate
      setMaxCharacterError(false); // Remove error message
    }
  };
  // sasdasdasd;
  return (
    <>
      <Helmet>
        <title>Create Subject</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Grid
            container
            spacing={2}
            sx={{ width: '100%' }}
            alignItems='center'
          ></Grid>
          <Grid container spacing={2} sx={{ my: 1 }}>
            <Grid item xs={6}>
              <Typography variant='h1' sx={{ fontSize: 30, fontWeight: 600 }}>
                Create Subject
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Button
                variant='contained'
                className='custom-button'
                href={`/course/${courseGuid}/subjects`}
                component={Link}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} sx={{ mt: 3 }}>
                    <FormTextField
                      control={control}
                      label='Title'
                      variant='outlined'
                      name='title'
                      pattern='[A-Za-z]{1,}'
                      style={{ width: '100%' }}
                      onChange={handleInputChange}
                      required
                      value={title}
                      error={!isInputValid}
                      helperText={
                        !isInputValid
                          ? 'Title must be between 3 and 35 characters'
                          : ''
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel htmlFor='course-desc' sx={{ my: 1 }}>
                      Description
                    </InputLabel>
                    <FormEditorField
                      id='course-desc'
                      control={control}
                      name='description'
                      value={description}
                      onChange={handleTextareaChange}
                    />
                    {isTextareaValid && (
                      <Typography color='error'>
                        Description must be at least 100 characters
                      </Typography>
                    )}
                  </Grid>
                  {/* <Grid item xs={12}>
                    <InputLabel htmlFor='course-desc' sx={{ my: 1 }}>
                      Description
                    </InputLabel>
                    <FormEditorField
                      id='course-desc'
                      control={control}
                      name='description'
                    />
                  </Grid> */}

                  {/* <Grid item xs={12}>
                    <input
                      name='userfile'
                      onChange={handleFileChange}
                      type='file'
                      id='file-upload'
                      hidden
                      //helperText={errors.userfile && "File is required"}
                    />
                    <label
                      htmlFor='file-upload'
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FileUploadIcon
                        sx={{
                          color: '#EAC43D',
                          width: '50px',
                          height: '50px',
                          cursor: 'pointer',
                        }}
                      />
                      Import File
                    </label>
                    <Box sx={{ mt: 1 }}>
                      {selectedFile ? selectedFile : 'No file selected'}
                    </Box>
                    {fileError && (
                      <Typography color='error'>
                        File size exceeds the limit (max 300MB).
                      </Typography>
                    )}
                  </Grid> */}
                  <div className='add-file'>
                    <input
                      name='userfile'
                      id='file-input'
                      type='file'
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <strong>Upload File</strong>
                    <label htmlFor='file-input'>
                      <IconButton component='span'>
                        <FileUploadIcon
                          sx={{
                            color: '#EAC43D',
                            width: '50px',
                            height: '50px',
                            cursor: 'pointer',
                          }}
                        />
                      </IconButton>
                    </label>
                    <span>{filename ? filename : 'No file selected'}</span>
                    {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
                  </div>
                </Grid>

                <Button
                  variant='contained'
                  size='medium'
                  type='submit'
                  sx={{ mt: 5 }}
                  className='custom-button'
                >
                  Create
                </Button>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};
export default CreateSubject;
