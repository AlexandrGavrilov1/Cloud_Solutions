import * as React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

// 1. Стили Gravity UI (обязательно до ваших стилей)
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import "@gravity-ui/markdown-editor/dist/styles.css";

// 2. Компоненты Gravity UI
import { ToasterProvider, configure as configureUI } from "@gravity-ui/uikit";
import { configure as configureEditor } from "@gravity-ui/markdown-editor";

import App from "./App";

// 4. Настройка локализации
configureUI({ lang: "ru" });
configureEditor({ lang: "ru" });

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </HelmetProvider>,
);
