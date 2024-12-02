import React from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const DrawerItem = ({ selected, index, onClick, icon, text }) => (
  <ListItemButton selected={selected === index} onClick={onClick}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={text} />
  </ListItemButton>
);

export default DrawerItem;
