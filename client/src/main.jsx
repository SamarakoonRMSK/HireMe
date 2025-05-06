import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { SocketContextProvider } from "./context/SocketContext.jsx";

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};


loadGoogleMapsScript()
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.StrictMode>
            <SocketContextProvider>
              <App />
            </SocketContextProvider>
          </React.StrictMode>
        </PersistGate>
      </Provider>
    );

  }).catch((error)=>{
    console.error('Failed to load Google Maps API:', error);
    ReactDOM.createRoot(document.getElementById("root")).render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.StrictMode>
            <SocketContextProvider>
              <App />
            </SocketContextProvider>
          </React.StrictMode>
        </PersistGate>
      </Provider>
    );
  })

