// App.jsx - SIMPLIFIED
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { ThemeProvider } from "./theme/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import "./styles/reset.css";
import "./styles/global.css";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                borderRadius: "8px",
                padding: "12px 16px",
              },
              success: {
                iconTheme: {
                  primary: "#2e7d32",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#d32f2f",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
