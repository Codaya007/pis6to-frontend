"use client";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";

const requestTypes = [
    { value: "climatic", label: "Datos Climáticos" },
    { value: "nodeFailure", label: "Fallo de Nodos" }
];

export default function GenerateDownloadRequest() {
    const [requestType, setRequestType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errors, setErrors] = useState({
        requestType: "",
        startDate: "",
        endDate: ""
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        // Validación básica
        let valid = true;
        const newErrors = { ...errors };

        if (!data.get("requestType")) {
            newErrors.requestType = "El tipo de solicitud es requerido";
            valid = false;
        } else {
            newErrors.requestType = "";
        }

        if (!data.get("startDate")) {
            newErrors.startDate = "La fecha de inicio es requerida";
            valid = false;
        } else {
            newErrors.startDate = "";
        }

        if (!data.get("endDate")) {
            newErrors.endDate = "La fecha de fin es requerida";
            valid = false;
        } else {
            newErrors.endDate = "";
        }

        setErrors(newErrors);

        if (valid) {
            console.log({
                requestType: data.get("requestType"),
                startDate: data.get("startDate"),
                endDate: data.get("endDate")
            });

            // Aquí puedes agregar lógica adicional, como enviar los datos al backend
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <DownloadIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Generar Solicitud de Descarga
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel id="requestType-label">Tipo de Solicitud</InputLabel>
                                <Select
                                    labelId="requestType-label"
                                    id="requestType"
                                    name="requestType"
                                    value={requestType}
                                    label="Tipo de Solicitud"
                                    onChange={(e) => setRequestType(e.target.value)}
                                    error={!!errors.requestType}
                                >
                                    {requestTypes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.requestType && (
                                    <Typography color="error" variant="body2">
                                        {errors.requestType}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="startDate"
                                label="Fecha de Inicio"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                name="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                error={!!errors.startDate}
                                helperText={errors.startDate}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="endDate"
                                label="Fecha de Fin"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                name="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                error={!!errors.endDate}
                                helperText={errors.endDate}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Generar Solicitud
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
