import * as React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

// Gravity UI: сначала стили
// import '@gravity-ui/uikit/styles/fonts.css';
// import '@gravity-ui/uikit/styles/styles.css';
// import '@gravity-ui/markdown-editor/dist/styles.css';

// Затем импорты компонентов и конфигурации
//import { ToasterProvider, configure as configureUI } from '@gravity-ui/uikit';
//import { configure as configureEditor } from '@gravity-ui/markdown-editor';

// Ваши стили (после Gravity UI, чтобы можно было переопределять)
import "./index.css";

import App from "./App";

// Настройка локализации
//configureUI({ lang: 'ru' });
//configureEditor({ lang: 'ru' });

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    //{" "}
    <ToasterProvider>
      <App />
      //
    </ToasterProvider>
  </HelmetProvider>,
);
