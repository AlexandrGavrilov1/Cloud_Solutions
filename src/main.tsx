import * as React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

// Импорты Gravity UI (порядок важен!)
import { ToasterProvider, configure as configureUI } from "@gravity-ui/uikit";
import { configure as configureEditor } from "@gravity-ui/markdown-editor";

// Стили Gravity UI
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";
import "@gravity-ui/markdown-editor/dist/styles.css";

// Ваши стили (после Gravity UI, чтобы можно было переопределять при необходимости)
import "./index.css";

import App from "./App";

// Настройка локализации для Gravity UI (русский язык)
configureUI({ lang: "ru" });
configureEditor({ lang: "ru" });

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </HelmetProvider>,
);
