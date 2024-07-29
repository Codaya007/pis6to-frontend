"use client";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Divider from "@mui/material/Divider";
import DescriptionIcon from "@mui/icons-material/Description";
import Link from "@mui/material/Link";
import { getAllDownloadRequests } from "@/services/downloadRequest.service"; // Ajusta la ruta según tu estructura
import { useAuth } from "@/context/AuthContext";

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { results } = await getAllDownloadRequests(token);
                setRequests(results);
            } catch (err) {
                setError(err.message || "Error fetching requests");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchRequests();
        }
    }, [token]);

    
    if (error) return <Typography color="error">{error}</Typography>;

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
                                                Fecha solicitud: {new Date(request.createdAt).toLocaleString()}
                                                <br />
                                                <span style={{ color: request.status === "Aceptada" ? "green" : request.status === "Denegada" ? "red" : "orange" }}>
                                                    Estado: {request.status}
                                                </span>
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
