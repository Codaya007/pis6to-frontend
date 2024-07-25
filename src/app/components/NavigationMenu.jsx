"use client"
import React, { useEffect } from "react";
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
import HistoryIcon from "@mui/icons-material/History";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from "@/context/AuthContext";
import { ADMIN_ROLE_NAME, RESEARCHER_ROLE_NAME } from "@/constants";

const NavigationMenu = () => {
    let { user, logoutUser, loginUser } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    // user = { role: { name: "Administrador" } }

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

    const menuItemsNoUser = [
        { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
        { label: "Historial", icon: <HistoryIcon />, path: "/monitoringStation/sensors/history" },
        { label: "Registrarse", icon: <PersonAddAltIcon />, path: "/auth/register" },
        { label: "Iniciar sesión", icon: <LoginIcon />, path: "/auth/login" }
    ];

    useEffect(() => {
        if (!user) {
            const userData = window.localStorage.getItem("user")
            const token = window.localStorage.getItem("token")

            // Si ya hay sesión, logueo al usuario, sino, lo mando al login
            if (userData && token) {
                loginUser(JSON.parse(userData), token)
            }
        }
    }, []);

    if (user?.role.name === ADMIN_ROLE_NAME) {
        menuItems.push(
            { label: "Administradores", icon: <PeopleIcon />, path: "/users/admins" },
            { label: "Investigadores", icon: <PeopleIcon />, path: "/researchers" },
            { label: "Nodos", icon: <WifiIcon />, path: "/monitoringStation/nodes" },
            { label: "Estaciones de monitoreo", icon: <PlaceIcon />, path: "/monitoringStation" },
            { label: "Historial", icon: <HistoryIcon />, path: "/monitoringStation/sensors/history" },
            { label: "Alertas", icon: <NotificationsIcon />, path: "/alerts" },
            { label: "Solicitudes de descarga", icon: <LockIcon />, path: "/download-request" },
            // { label: "Solicitudes de descarga", icon: <LockIcon />, path: "/application-form" },
            { label: "Sensores", icon: <WifiIcon />, path: "monitoringStation/sensors" },
            // { label: "Sensores", icon: <WifiIcon />, path: "/monitoringStation/sensors/createSensors" },
            { label: "Límites de Seguridad", icon: <SettingsIcon />, path: "/system-settings/security-limits" },
            { label: "Actividades del Sistema", icon: <SettingsIcon />, path: "/activities" },
            // { label: "Actividades del Sistema", icon: <SettingsIcon />, path: "/system-settings/system-activities" },
        );
    } else if (user?.role.name === RESEARCHER_ROLE_NAME) {
        menuItems.push(
            { label: "Mis Solicitudes", icon: <NotificationsIcon />, path: "/my-request" },
            // { label: "Solicitar datos", icon: <GetAppIcon />, path: "/access-requests/create" },
            { label: "Solicitar datos", icon: <LockIcon />, path: "/application-form" },
        );
    }

    return (
        <>
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                {user ?
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
                    </List> :
                    <List>
                        {menuItemsNoUser.map((item) => (
                            <ListItem button key={item.label} onClick={() => handleNavigation(item.path)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>}
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
