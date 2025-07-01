import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00', // Neon Green
    },
    secondary: {
      main: '#00ffff', // Cyan
    },
    background: {
      default: '#0a0a0a', // Very dark grey/black
      paper: '#1a1a1a', // Slightly lighter dark grey
    },
    text: {
      primary: '#00ff00',
      secondary: '#00ffff',
    },
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
    h4: {
      color: '#00ff00',
    },
    h6: {
      color: '#00ff00',
    },
    body1: {
      color: '#00ff00',
    },
    body2: {
      color: '#00ffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderBottom: '1px solid #00ff00',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0a0a',
          borderRight: '1px solid #00ff00',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#00ff00',
          borderColor: '#00ff00',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            borderColor: '#00ff00',
          },
        },
        containedPrimary: {
          backgroundColor: '#00ff00',
          color: '#0a0a0a',
          '&:hover': {
            backgroundColor: '#00cc00',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: '#00ffff',
          },
          '& .MuiInputBase-input': {
            color: '#00ff00',
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: '#00ffff',
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#00ff00',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#00ff00',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #00ffff',
          boxShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0a0a0a',
          border: '1px solid #00ff00',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#00ff00',
        },
        secondary: {
          color: '#00ffff',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;