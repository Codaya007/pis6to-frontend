"use client";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import DescriptionIcon from "@mui/icons-material/Description";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

const sampleRequests = [
    { id: 1, title: "Solicitud 1", content: "Contenido de la solicitud 1", url: "https://example.com/1", type: "Tipo 1", timestamp: "2023-07-01 10:00:00" },
    { id: 2, title: "Solicitud 2", content: "Contenido de la solicitud 2", url: "https://example.com/2", type: "Tipo 2", timestamp: "2023-07-02 11:00:00" },
    { id: 3, title: "Solicitud 3", content: "Contenido de la solicitud 3", url: "https://example.com/3", type: "Tipo 3", timestamp: "2023-07-03 12:00:00" },
    // Añade más solicitudes según sea necesario
];

export default function MyRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Aquí puedes hacer una llamada a tu API para obtener las solicitudes
        // Por ahora usaremos datos de ejemplo
        setRequests(sampleRequests);
    }, []);

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
                    <DescriptionIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Mis Solicitudes
                </Typography>
                <Box sx={{ mt: 3, width: '100%' }}>
                    <List>
                        {requests.map((request) => (
                            <React.Fragment key={request.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "primary.main" }}>
                                            <DescriptionIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={request.title}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    Contenido: {request.content}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    URL: <Link href={request.url} target="_blank" rel="noopener">
                                                        {request.url}
                                                    </Link>
                                                </Typography>
                                                <br />
                                                Tipo: {request.type}
                                                <br />
                                                Marca de tiempo: {request.timestamp}
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                </Box>

            </Box>
        </Container>
    );
}
