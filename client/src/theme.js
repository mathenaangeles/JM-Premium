import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: `'Open Sans', sans-serif`,
    h1: { fontFamily: `'DM Serif Display', serif` },
    h2: { fontFamily: `'DM Serif Display', serif` },
    h3: { fontFamily: `'DM Serif Display', serif` },
    h4: { fontFamily: `'DM Serif Display', serif` },
    h5: { fontFamily: `'DM Serif Display', serif` },
    h6: { fontFamily: `'DM Serif Display', serif` },
  },
  palette: {
    common: {
      black: '#1B1B1B',
      white: '#FAF9F6',
      grey:  '#726E69',
      creme: '#ECE4CE'
    },
    primary: {
      main: '#97A763',
      light: '#F1F6E9'
    },
    secondary: {
      main: '#607049',
    },
    error: {
      main: '#C85A5A',
    },
    background: {
      default: '#FFFFFF',
    },
    text: {
      primary: '#1B1B1B',
    },
  },
  components: {
    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: '#FFA41C',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        }
      }
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#FAF9F6',
            backgroundColor: '#97A763', 
            fontWeight: 600,
          },
          '&:hover': {
            color: '#1B1B1B',
            backgroundColor: '#726E69'
          },
        },
      }
    },
    MuiPagination: {
      styleOverrides: {
        ul: {
          flexWrap: 'nowrap',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1B1B1B',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#FAF9F6',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 50,
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: 1.5,
        },
        contained: {
          color: '#FAF9F6',
        }
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& fieldset': {
            borderColor: '#BBB6AA',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#97A763',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#97A763',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label': {
            color: '#607049',
          },
        },
      },
    },
  },
});

export default theme;
