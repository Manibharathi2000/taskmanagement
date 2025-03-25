import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { AppProvider } from './components/ApiService/AppProvider';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AppProvider>
        <Router />
      </AppProvider>
    </MantineProvider>
  );
}
