import { Box, Button, Container, TextField, Typography } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
      email: 'john@team.com',
      password: 'JohnDoe123',
    },
    validationSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      const { user } = await login(email, password);
      if (user) {
        handleReset({
          values: {
            email: '',
            password: '',
          },
        });
        navigate('/dashboard');
      }
    },
  });

  useEffect(() => {
    if (isSignedIn()) {
      navigate('/dashboard');
    }
  });

  return (
    <>
      <Container maxWidth='lg' sx={{ height: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
            height: '100%',
          }}>
          <Typography variant='h4' sx={{ textAlign: 'center', mt: 3 }}>
            User Task Management System - Login
          </Typography>
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
      </Container>
    </>
  );
};

export default Login;
