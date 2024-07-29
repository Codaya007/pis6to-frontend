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
import { getAllUserDownloadRequests } from "@/services/downloadRequest.service"; // Ajusta la ruta según tu estructura
import { useAuth } from "@/context/AuthContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Loading from "../components/Loading";

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true)
                const { results } = await getAllUserDownloadRequests(token);
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
            {loading ?

                <Loading />
                :
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
                            {requests?.length ? requests.map((request) => {
                                // request.generatedFiles.xlsx = "io.com"
                                // request.generatedFiles.json = "io.com"

                                return <React.Fragment key={request.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                                <DescriptionIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textSecondary"
                                                        sx={{ float: 'right', fontSize: '0.8em' }}
                                                    >
                                                        Solicitado el {new Date(request.createdAt).toLocaleString()}
                                                    </Typography>
                                                    {request.title}
                                                </>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body1" color="textPrimary">
                                                        Tipo de descarga:
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        {request.downloadType}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body1" color="textPrimary">
                                                        Detalles adicionales:
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="body2" color="textSecondary">
                                                        {request.comment}
                                                    </Typography>
                                                    <br />
                                                    {request.filterDate?.from || request.filterDate?.to ? (
                                                        <>
                                                            <Typography component="span" variant="body1" color="textPrimary">
                                                                Intervalo de fechas:
                                                            </Typography>
                                                            <br />
                                                            <Typography component="span" variant="body2" color="textSecondary">
                                                                {request.filterDate?.from && `Desde el ${request.filterDate?.from}`} {request.filterDate?.to && ` hasta el ${request.filterDate?.to}`}
                                                            </Typography>
                                                            <br />
                                                        </>
                                                    ) : null}
                                                    {request.generatedFiles?.xlsx || request.filterDate?.json ? (
                                                        <>
                                                            <Typography component="span" variant="body1" color="textPrimary">
                                                                Archivos generados:
                                                            </Typography>
                                                            <br />
                                                            <Typography component="span" variant="body2" color="textSecondary">
                                                                {request.generatedFiles?.xlsx &&
                                                                    <>
                                                                        Formato XLSX: <Link>{request.generatedFiles?.xlsx}</Link>
                                                                        <br />
                                                                    </>
                                                                }
                                                                {request.generatedFiles?.json &&
                                                                    <>
                                                                        Formato JSON: <Link>{request.generatedFiles?.json}</Link>
                                                                    </>
                                                                }
                                                            </Typography>
                                                            <br />
                                                        </>
                                                    ) : null}
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
                            }) :
                                <ListItem style={{ display: "flex", flexDirection: "column" }}>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        Aún no ha realizado ninguna solicitud de descarga de datos
                                    </Typography>
                                    <br />
                                    <br />
                                    <Button
                                        variant="contained"
                                        onClick={() => router.push("/download-request/create")}
                                    >
                                        Solicitar descarga de datos
                                    </Button>
                                </ListItem>
                            }
                        </List>
                    </Box>
                </Box>}
        </Container>
    );
}
