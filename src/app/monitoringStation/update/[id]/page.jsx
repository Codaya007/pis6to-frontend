"use client";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MyLocationIcon from '@mui/icons-material/MyLocation'; import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { areasDeTrabajo } from "@/constants";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { AccountCircle } from "@mui/icons-material";


const validationSchema = object().shape({
    name: string()
        .required("Campo requerido"),
    reference: string()
        .max(200, "Máximo 200 caracteres"),
    photos: string()
        //   .matches(IP_REGEX, "Ip no válida")
        .required("Foto es requerida"),
    nomenclature: string().required("Nomenclatura requerida")
    // nomenclature: string().required("Rol requerido").matches(UUID_REGEX, "Debe ser un rol válido"),
});


export default function CreateMonitoringStation() {
    const router = useRouter();
    const [area, setArea] = useState('');
    const { id } = useParams();
    const { token } = useAuth();
    const [monitoringStation, setMonitoringStation] = useState({});

    const formOptions = {
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    };

    const { register, handleSubmit, formState, reset } = useForm(formOptions)

    const [errors, setErrors] = useState({
        name: "",
        reference: "",
        photos: "",
        nomenclature: "",
    });

    const handleStation = async (data) => {
        try {
            // await updateStation(id, data, token);
            mensajes("Exito", "Mota actualizada exitosamente");
            router.push("/monitoringStation");
        } catch (error) {
            console.log(error?.response?.data || error);
            mensajes("Error", error.response?.data?.customMessage || "No se ha podido actualizar la mota", "error");
        }
    }

    const handleBlur = (event) => {
        const { name, value } = event.target;

        // Validación básica de campos requeridos
        switch (name) {
            case "name":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: value ? "" : "El nombre es requerido",
                }));
                break;
            case "reference":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    reference: value ? "" : "La referencia es requerida",
                }));
                break;
            case "photos":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    photos: value ? "" : "Las fotos son requeridas",
                }));
                break;
            case "nomenclature":
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    nomenclature: value ? "" : "La nomenclatura es requerida",
                }));
                break;

            // Agregar más validaciones según sea necesario para los demás campos
            default:
                break;
        }
    };

    const fetchMonitoringStation = async () => {
        //   const { results } = await getNodeById(id, token);

        //   reset({
        //     name: results.name,
        //     reference: results.reference,
        //     nomenclature: results.nomenclature,
        //     rol: results.rol
        //   });
        reset({
            name: "Station 1",
            reference: "Ref1",
            photos: "Ph1",
            nomenclature: "nomen1"
        });
    }
    useEffect(() => {
        //   if (token) {
        fetchMonitoringStation();
        //   }

        setMonitoringStation({ id: 1, name: "Station 1", reference: "Ref1", photos: "Ph1", nomenclature: "nomen1" });
        console.log(monitoringStation);
    }, [token]);

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}

            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <MyLocationIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Actualizar estación de monitoreo
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(handleStation)} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        {/* Información básica */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.name}
                                helperText={errors.name}
                                autoComplete="given-name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                {...register("name")}
                                label="Nombre"
                                //TOD: CAMBIAR BVALUE
                                defaultValue={"Nombre"}
                                autoFocus

                            />
                            {/* Si no funciona es este */}
                            {/* <TextField
                                id="input-with-icon-textfield"
                                label="TextField"
                                InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <AccountCircle />
                                    </InputAdornment>
                                ),
                                }}
                                variant="standard"
                             /> */}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                onBlur={handleBlur}

                                error={!!errors.reference}
                                helperText={errors.reference}
                                required
                                fullWidth
                                id="reference"
                                label="Referecia"
                                name="reference"
                                // defaultValue={"Referenccia"}
                                autoComplete="family-name"
                                {...register("reference")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register("photos")}
                                onBlur={handleBlur}
                                error={!!errors.photos}
                                helperText={errors.photos}
                                required
                                fullWidth
                                id="photos"
                                type="file"
                                label="Fotos"
                                name="photos"
                                defaultValue={"Cambiea"}
                                autoComplete="photos"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onBlur={handleBlur}
                                error={!!errors.nomenclature}
                                helperText={errors.nomenclature}
                                required
                                fullWidth
                                name="nomenclature"
                                label="Nomenclatura"
                                type="text"
                                defaultValue={"Nomenclatura"}
                                id="nomenclature"
                                autoComplete="nomenclature"
                            />
                        </Grid>
                    </Grid>

                    {/* Información académica */}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Guardar
                    </Button>

                    {/* <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 2,backgroundColor: 'rgba(255, 165, 0, 0.8)', // Naranja opaco
                '&:hover': {
                    backgroundColor: 'rgba(255, 140, 0, 0.8)', // Un poco más oscuro al hacer hover
                } }}>
                        Cancelar
                    </Button> */}

                </Box>
            </Box>
        </Container>
    );
}
