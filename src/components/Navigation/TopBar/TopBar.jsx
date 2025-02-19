import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import "./TopBar.css"

function TopBar() {
  return (
    <AppBar className="top-bar">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Generational Cookbook
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar