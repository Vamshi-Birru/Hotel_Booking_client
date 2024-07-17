import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./register.css";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
    const [credentials, setCredentials] = useState({
        username: "",
        email: "",
        country: "",
        city: "",
        phone: "",
        isAdmin: false,
        password: "",
    });
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get("https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json")
            .then(res => setData(res.data))
            .catch(err => console.log("Error: ", err));

    }, []);

    const { loading, error, dispatch } = useContext(AuthContext);

    const navigate = useNavigate()
    var selectedCountryCities = [];


    const handleChange = (e, field) => {
        if (field === "country") {
            console.log(e);
            setCredentials((prev) => ({
                ...prev,
                country: e.target.value,
                city: ""
            }));
        } else if (field === "city") {
            setCredentials((prev) => ({
                ...prev,
                city: e.target.value,
            }));
        }
        else {
            const { id, value } = e.target;
            setCredentials((prev) => ({ ...prev, [id]: value }));
        }


    };

    const countryList = [...new Set(data.map(item => item.country))];

    // console.log(countryList);
    const filterCountryOptions = (inputValue) => {
        // console.log(inputValue)
        return countryList
            .filter((country) =>
                country.toLowerCase()?.startsWith(inputValue?.toLowerCase())
            )
            .map((country) => ({
                label: country,
                value: country,
            }));
    };
    const filterCityOptions = (inputValue) => {
        const selectedCountry = credentials.country;
        selectedCountryCities = data.filter(city => city.country === selectedCountry).map(city => city.name);

        return selectedCountryCities
            .filter((city) =>
                city.toLowerCase()?.startsWith(inputValue?.toLowerCase())
            )
            .map((city) => ({
                label: city,
                value: city,
            }));
    };





    const handleSubmit = async(event) => {
        event.preventDefault();
        dispatch({ type: "REGISTER_START" });
        try {
            const res = await axios.post("https://booking-api-3l8s.onrender.com/api/auth/register", credentials);
            dispatch({ type: "RESISTER_SUCCESS", payload: res.data.details });
            alert(res);
            
            navigate("/")
        }
        catch (err) {
            dispatch({ type: "REGISTER_FAILURE", payload: err.response.data });
            console.log("ERROR: ", err);
        }

    };

    return (
        <div style={{
            backgroundImage: `url(https://images.unsplash.com/flagged/photo-1551373916-bdaddbf4f881?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHdoaXRlJTIwYXJ0fGVufDB8fDB8fHww)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {/* <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid> */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    onChange={handleChange}
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField

                                    fullWidth
                                    onChange={handleChange}
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Country</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={credentials.country}
                                        label="Country"
                                        onChange={(event) => handleChange(event, "country")}
                                    >
                                        <MenuItem value="">Select Country</MenuItem>
                                        {filterCountryOptions(credentials.country).map((option) => (
                                            <MenuItem value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">City</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={credentials.city}
                                        label="City"
                                        onChange={(event) => handleChange(event, "city")}
                                    >
                                        <MenuItem value="">Select City</MenuItem>
                                        {filterCityOptions(credentials.city).map((option) => (
                                            <MenuItem value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                <TextField
                fullWidth
                  type="tel"
                  label="Phone"
                  pattern="[0-9]{10}"
                  
                  id="phone"
                  onChange={ handleChange}
                  className="rInput"
                  
                />
              </Grid>
                            <Grid item xs={12}>
                                <TextField

                                    fullWidth
                                    onChange={handleChange}
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid> */}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Login
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
        </div>
    );
}