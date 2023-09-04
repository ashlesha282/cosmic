import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Grid,
  Link,
  Button,
  TextField,
  MenuItem,
  Menu,
  CircularProgress,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  Alert,
  ButtonGroup,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import SidebarLeft from '../../../components/Sidebar/SidebarLeft';
import Course from '../../../assets/images/Course.jpg';
import BASE_URL from '../../../Utils/baseUrl';
import token from '../../../Utils/token';
import Network from '../../../Utils/network';
import { useTheme } from '@mui/material/styles';
import CheckTokenValid from '../../../components/Redirect/CheckTokenValid';

const options = [
  {
    label: 'Manage',
    link: '/course/manage',
  },
  {
    label: 'Update',
    link: '/course/update',
  },
];

const ITEM_HEIGHT = 48;

const Subjects = () => {
  const { courseGuid } = useParams();
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;
  // State Manage
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  // Authorization
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);
  myHeaders.append('Network', `${Network}`);

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  // Fetch Subjects list
  useEffect(() => {
    const fetchSubjects = async () => {
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      try {
        const response = await fetch(`${BASE_URL}/course/list`, requestOptions);
        const result = await response.json();
        setCourses(result.payload.data);
        setLoading(false);
      } catch (error) {
        console.log('error', error);
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const filteredCourse =
    courses &&
    courses.filter((course) => {
      const searchVal = `${course.title} ${course.description}`.toLowerCase();
      const searchValue = searchTitle.toLowerCase();

      if (filterOption === 'all') {
        return searchVal.includes(searchValue);
      } else if (filterOption === 'published') {
        return (
          searchVal.includes(searchValue) && course.status === '1' // Published courses
        );
      } else if (filterOption === 'unpublished') {
        return (
          searchVal.includes(searchValue) && course.status === '0' // Unpublished courses
        );
      } else if (filterOption === 'archive') {
        return (
          searchVal.includes(searchValue) && course.status === '2' // Archived courses
        );
      }

      return true; // By default, show all courses
    });

  // Pagination here
  const [currentPage, setCurrentPage] = useState(1);
  const [coursePerPage] = useState(10);
  const lastIndex = currentPage * coursePerPage;
  const firstIndex = lastIndex - coursePerPage;
  const currentCourse = filteredCourse.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(
    filteredCourse && filteredCourse.length / coursePerPage
  );
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  function prePage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  }

  // Action Button
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentCourseGuid, setCurrentCourseGuid] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentCourseGuid(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Delete
  const [alertOpen, setAlertOpen] = useState(null);
  const [isActionSuccess, setIsActionSuccess] = useState(null);
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const handleConfirmOpen = () => {
    setActionConfirmOpen(true);
  };
  const actionConfirmClose = () => {
    setActionConfirmOpen(false);
  };
  // Delete function on submit
  const handleBulkDeleteUser = async () => {
    setActionConfirmOpen(false);
    const requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    };
    try {
      const res = await fetch(
        `${BASE_URL}/course/delete/${currentCourseGuid}`,
        requestOptions
      );
      const result = await res.json();
      setAlertOpen(true);
      if (result.success === true) {
        setIsActionSuccess(true);
        setTimeout(() => {
          setAlertOpen(false);
          window.location.reload(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      }
      setActionConfirmOpen(false);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to post status: ${error.message}`);
    }
  };
  return (
    <>
      <CheckTokenValid />
      <Helmet>
        <title>All Subjects</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarLeft />
        <Dialog
          open={actionConfirmOpen}
          onClose={actionConfirmClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Are you sure you want to delete this course?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={actionConfirmClose} color='primary'>
              Cancel
            </Button>
            <Button onClick={handleBulkDeleteUser} color='primary' autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setIsActionSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={isActionSuccess === true ? 'success' : 'warning'}>
            {isActionSuccess === true
              ? 'Course Deleted Successfully'
              : 'Course not deleted.'}
          </Alert>
        </Snackbar>

        <Box sx={{ flexGrow: 1, p: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <h1>All Subjects</h1>
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'right' }}>
              <Button
                component={Link}
                href={`/course/${courseGuid}/subject/create`}
                variant='contained'
              >
                Create Subject
              </Button>
            </Grid>
          </Grid>
          {loading ? (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : courses && courses.length !== 0 ? (
            <>
              <Grid
                container
                spacing={2}
                sx={{ mt: 3, justifyContent: 'space-between' }}
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    label='Search by title and description'
                    placeholder='Search by title'
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id='filter-label'>Filter by Status</InputLabel>
                    <Select
                      labelId='filter-label'
                      label='Filter by Status'
                      id='filter-select'
                      value={filterOption}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value='all'>All</MenuItem>
                      <MenuItem value='published'>Published</MenuItem>
                      <MenuItem value='unpublished'>Unpublished</MenuItem>
                      <MenuItem value='archive'>Archive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 2 }}
                className='manage-course'
              >
                <Grid item xs={12}>
                  {currentCourse && currentCourse.length !== 0 ? (
                    <Card>
                      {currentCourse &&
                        currentCourse.map((course, index) => (
                          <Box sx={{ px: 3 }} key={index}>
                            <Grid
                              container
                              sx={{
                                borderBottom: '1px solid #B8B8B8',
                                py: 2,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={1}
                                sx={{
                                  display: { xs: 'flex', md: 'block' },
                                  justifyContent: { xs: 'space-between' },
                                }}
                              >
                                <Box className='course-image'>
                                  <img
                                    src={Course}
                                    alt={course.title}
                                    loading='lazy'
                                  />
                                </Box>
                                <Grid
                                  item
                                  sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                  <IconButton
                                    aria-label='more'
                                    id='long-button1'
                                    aria-controls={
                                      open ? 'long-menu' : undefined
                                    }
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup='true'
                                    onClick={(event) =>
                                      handleClick(event, course.guid)
                                    }
                                    className='no-pd'
                                  >
                                    <MoreVertOutlinedIcon />
                                  </IconButton>
                                  <Menu
                                    sx={{
                                      boxShadow:
                                        '0px 0px 7px -5px rgba(0,0,0,0.1)',
                                    }}
                                    id='long-menu1'
                                    MenuListProps={{
                                      'aria-labelledby': 'long-button1',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                      style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                      },
                                    }}
                                  >
                                    {options.map((option, index) => {
                                      const linkUrl = `${option.link}/${currentCourseGuid}`;
                                      return (
                                        <MenuItem
                                          key={index}
                                          onClick={handleClose}
                                        >
                                          <Link
                                            href={linkUrl}
                                            underline='none'
                                            color='inherit'
                                          >
                                            {option.label}
                                          </Link>
                                        </MenuItem>
                                      );
                                    })}
                                    <MenuItem
                                      value='delete'
                                      onClick={handleConfirmOpen}
                                    >
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <h3>
                                  <Link
                                    href={`/course/manage/${course.guid}`}
                                    sx={{
                                      textDecoration: 'none',
                                      color: 'inherit',
                                    }}
                                  >
                                    {course.title}
                                  </Link>
                                </h3>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <h4>{course.created_by}</h4>
                              </Grid>
                              <Grid item xs={12} md={2}>
                                {course.status === '0' ? (
                                  <Typography
                                    variant='span'
                                    component='span'
                                    color='secondary'
                                  >
                                    Unpublished
                                  </Typography>
                                ) : course.status === '1' ? (
                                  <Typography
                                    variant='span'
                                    component='span'
                                    color={successColor}
                                  >
                                    Published
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant='span'
                                    component='span'
                                    color='primary'
                                  >
                                    Archived
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={1}>
                                <Grid
                                  item
                                  sx={{ display: { xs: 'none', md: 'block' } }}
                                >
                                  <IconButton
                                    aria-label='more'
                                    id='long-button'
                                    aria-controls={
                                      open ? 'long-menu' : undefined
                                    }
                                    aria-expanded={open ? 'true' : undefined}
                                    aria-haspopup='true'
                                    onClick={(event) =>
                                      handleClick(event, course.guid)
                                    }
                                    className='no-pd'
                                  >
                                    <MoreVertOutlinedIcon />
                                  </IconButton>
                                  <Menu
                                    id='long-menu'
                                    MenuListProps={{
                                      'aria-labelledby': 'long-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    PaperProps={{
                                      style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch',
                                      },
                                    }}
                                  >
                                    {options.map((option, index) => {
                                      const linkUrl = `${option.link}/${currentCourseGuid}`;
                                      return (
                                        <MenuItem
                                          key={index}
                                          onClick={handleClose}
                                        >
                                          <Link
                                            href={linkUrl}
                                            underline='none'
                                            color='inherit'
                                          >
                                            {option.label}
                                          </Link>
                                        </MenuItem>
                                      );
                                    })}
                                    <MenuItem
                                      value='delete'
                                      onClick={handleConfirmOpen}
                                    >
                                      Delete
                                    </MenuItem>
                                  </Menu>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                    </Card>
                  ) : (
                    <Alert sx={{ mt: 5 }} severity='error'>
                      Course not found!
                    </Alert>
                  )}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                sx={{ mt: 5, justifyContent: 'center' }}
              >
                <Grid item>
                  {filteredCourse && filteredCourse.length > coursePerPage ? (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        sx={{
                          textAlign: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          width: '100%',
                        }}
                      >
                        <ButtonGroup
                          color='primary'
                          aria-label='outlined primary button group'
                          className='pagination-button'
                        >
                          <Button
                            onClick={prePage}
                            disabled={currentPage === 1}
                          >
                            PREV
                          </Button>
                          {numbers.map((n, i) => (
                            <Button
                              className={currentPage === n ? 'active' : ''}
                              key={i}
                              onClick={() => changeCPage(n)}
                              style={{
                                backgroundColor:
                                  currentPage === n ? primaryColor : '',
                              }}
                            >
                              {n}
                            </Button>
                          ))}
                          <Button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                          >
                            NEXT
                          </Button>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <Alert sx={{ mt: 5 }} severity='error'>
              Course not found!
            </Alert>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Subjects;
