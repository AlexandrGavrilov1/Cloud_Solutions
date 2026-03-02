// Вспомогательная функция для создания элемента списка
const createListItem = (content: string) => {
  return `<li class="font-sans font-normal text-[18px] leading-tight text-theme-dark text-justify">${content}</li>`;
};

// Нумерованный список
const numberedListCommand: ICommand = {
  name: "numberedList",
  keyCommand: "numberedList",
  buttonProps: { "aria-label": "Нумерованный список" },
  icon: <span style={{ fontSize: 12 }}>1.</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const listItems = lines.map((line) => createListItem(line)).join("");
    const wrapped = `<ol class="list-decimal pl-5 space-y-1">${listItems}</ol>`;
    api.replaceSelection(wrapped);
  },
};

// Маркированный список с кругами
const discListCommand: ICommand = {
  name: "discList",
  keyCommand: "discList",
  buttonProps: { "aria-label": "Маркированный список (круги)" },
  icon: <span style={{ fontSize: 12 }}>•</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const listItems = lines.map((line) => createListItem(line)).join("");
    const wrapped = `<ul class="list-disc pl-5 space-y-1">${listItems}</ul>`;
    api.replaceSelection(wrapped);
  },
};

// Маркированный список с квадратами
const squareListCommand: ICommand = {
  name: "squareList",
  keyCommand: "squareList",
  buttonProps: { "aria-label": "Маркированный список (квадраты)" },
  icon: <span style={{ fontSize: 12 }}>■</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const listItems = lines.map((line) => createListItem(line)).join("");
    const wrapped = `<ul class="list-square pl-5 space-y-1">${listItems}</ul>`;
    api.replaceSelection(wrapped);
  },
};

// Список с галочками
const checkListCommand: ICommand = {
  name: "checkList",
  keyCommand: "checkList",
  buttonProps: { "aria-label": "Список с галочками" },
  icon: <span style={{ fontSize: 12 }}>✓</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Элемент списка";
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const checkItems = lines
      .map(
        (line) =>
          `<li class="font-sans font-normal text-[18px] leading-tight text-theme-dark text-justify list-none pl-5 relative before:content-['✓'] before:absolute before:left-0">${line}</li>`,
      )
      .join("");
    const wrappedWithChecks = `<ul class="space-y-1">${checkItems}</ul>`;
    api.replaceSelection(wrappedWithChecks);
  },
};
