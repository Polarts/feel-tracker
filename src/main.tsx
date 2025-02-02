import './styles/css-variables.scss';
import './styles/main.scss';
import { iconConfig } from '@assets/icons';
import { IconContext } from '@phosphor-icons/react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CategoryContextProvider from './features/categories/CategoriesContext';
import DayViewContextProvider from './features/views/day/DayViewContext';
import { InstallPromptProvider } from './data/contexts/InstallPromptContext';
import { AlertsPromptProvider } from './components/generic/Alert';
import { generateData } from './data/MOCK_DATA';
import { routesConfig } from './features/navigation/routes';

if (import.meta.env.DEV) generateData();

const router = createBrowserRouter([routesConfig]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <CategoryContextProvider>
    <DayViewContextProvider>
      <InstallPromptProvider>
        <AlertsPromptProvider>
          <IconContext.Provider value={iconConfig}>
            <RouterProvider router={router} />
          </IconContext.Provider>
        </AlertsPromptProvider>
      </InstallPromptProvider>
    </DayViewContextProvider>
  </CategoryContextProvider>
);

