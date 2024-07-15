"use client"
import React from "react";
import { useRouter } from "next/navigation";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import PlaceIcon from '@mui/icons-material/Place';
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "@/context/AuthContext";

const NavigationMenu = () => {
    let { user, logoutUser } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    user = { role: { name: "Administrador" } }

    const handleMobileMenuOpen = () => {
        setMobileMenuOpen(true);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logoutUser();
        router.push("/auth/login");
        handleMobileMenuClose(); // Cerrar menú después de cerrar sesión
    };

    const handleNavigation = (path) => {
        router.push(path);
        handleMobileMenuClose(); // Cerrar menú después de navegar a la página
    };

    const menuItems = [
        { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
        { label: "Mi Perfil", icon: <PersonIcon />, path: "/users/me" }
    ];

    if (user?.role.name === "Administrador") {
        menuItems.push(
            { label: "Administradores", icon: <PeopleIcon />, path: "/users/admins" },
            { label: "Investigadores", icon: <PeopleIcon />, path: "/users/researchers" },
            { label: "Nodos", icon: <WifiIcon />, path: "/nodes" },
            { label: "Estaciones de monitoreo", icon: <PlaceIcon />, path: "/monitoringStation" },
            { label: "Alertas", icon: <NotificationsIcon />, path: "/alerts" },
            { label: "Solicitudes de descarga", icon: <LockIcon />, path: "/application-form" },
            { label: "Sensores", icon: <WifiIcon />, path: "/sensors" },
            { label: "Límites de Seguridad", icon: <SettingsIcon />, path: "/system-settings/security-limits" },
            { label: "Actividades del Sistema", icon: <SettingsIcon />, path: "/system-settings/system-activities" }
        );
    } else if (user?.role.name === "Investigador") {
        menuItems.push(
            { label: "Mis Solicitudes", icon: <NotificationsIcon />, path: "/dashboard" },
            { label: "Solicitar datos", icon: <NotificationsIcon />, path: "/access-requests/create" }
        );
    }

    return (
        <>
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem button key={item.label} onClick={() => handleNavigation(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="Cerrar Sesión" />
                    </ListItem>
                </List>
            </Drawer>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleMobileMenuOpen}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Sistema de Monitoreo Ambiental
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default NavigationMenu;
