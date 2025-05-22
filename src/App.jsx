import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Paper } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import { useChatStore } from './store/chatStore';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00897B',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f0f2f5',  // Light grayish blue background
      paper: '#ffffff',    // White background for paper components
    },
  },
  typography: {
    h6: {
      fontWeight: 700,  // Make h6 (heading) bold
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f0f2f5',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
        '#root': {
          minHeight: '100vh',
          backgroundColor: '#f0f2f5',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(0, 0, 0, 0.12)',  // Add subtle border
        },
      },
    },
  },
});

function App() {
  const { initializeStore } = useChatStore();

  useEffect(() => {
    // Initialize store from localStorage if available
    initializeStore();
  }, [initializeStore]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
      }}>
        <Container 
          maxWidth="md" 
          sx={{ 
            height: '100vh', 
            py: 2,
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiTypography-h6': {  // Additional heading styles
                letterSpacing: '0.5px',
                fontSize: '1.25rem',
              }
            }}
          >
            <ChatInterface />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
