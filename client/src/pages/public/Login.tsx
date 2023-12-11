import { Box, Button, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import cover from '/cover.jpg';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const { login, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    handleReset,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      await login(email, password).then(() =>
        handleReset({
          values: {
            email: '',
            password: '',
          },
        })
      );
    },
  });

  useEffect(() => {
    if (isSignedIn()) {
      navigate('/manager');
    }
  }, [isSignedIn, navigate]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          gap: 2,
          scrollBehavior: 'smooth',
        }}>
        <Box
          sx={{
            width: { md: '50%' },
            display: { sm: 'none', md: 'block' },
            overflow: 'hidden',
            m: 0,
          }}>
          <img
            src={cover}
            alt='login'
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
            width: { md: '50%', sm: '100%' },
          }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h4'>User Management System</Typography>
            <Typography variant='h6'>Login</Typography>
          </Box>
          <TextField
            variant='standard'
            fullWidth
            onChange={handleChange}
            name='email'
            id='email'
            type='email'
            value={values.email}
            margin='normal'
            label='Email'
            placeholder='name@team.com'
            onBlur={handleBlur}
            error={!!errors.email && touched.email}
            helperText={touched.email && errors.email}
            autoFocus
          />
          <TextField
            variant='standard'
            fullWidth
            onChange={handleChange}
            name='password'
            id='password'
            type='password'
            value={values.password}
            margin='normal'
            label='Password'
            placeholder='name@team.com'
            onBlur={handleBlur}
            error={!!errors.password && touched.password}
            helperText={errors.password && touched.password}
          />
          <Box sx={{ display: 'flex', width: '100%', gap: 3, m: 3 }}>
            <Button
              variant='contained'
              onClick={handleReset}
              sx={{ width: '100%' }}>
              Reset
            </Button>
            <Button
              variant='contained'
              onClick={() => handleSubmit()}
              sx={{ width: '100%' }}>
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
