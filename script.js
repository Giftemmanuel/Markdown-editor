document.addEventListener("DOMContentLoaded", () => {
    const editor = document.getElementById("markdown-editor");
    const preview = document.getElementById("preview");
    const toggleMode = document.getElementById("toggle-mode");
    const saveBtn = document.getElementById("save-btn");
    const deleteBtn = document.getElementById("delete-doc");
    const docName = document.getElementById("doc-name");
    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");
    const closeSidebar = document.getElementById("close-sidebar");

    // Open Sidebar
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
    });

    // Close Sidebar
    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    // Load saved content
    editor.value = localStorage.getItem("markdownContent") || "# Welcome to Markdown\n\nMarkdown is a lightweight markup language that you can use...";
    preview.innerHTML = marked.parse(editor.value);

    // Markdown rendering on input
    editor.addEventListener("input", () => {
        preview.innerHTML = marked.parse(editor.value);
        localStorage.setItem("markdownContent", editor.value);
    });

    // Toggle dark mode
    toggleMode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    // Load dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    };

    // Save markdown content
    saveBtn.addEventListener("click", () => {
        const content = editor.value;
        const name = docName.value || "Untitled";
        const blob = new Blob([content], { type: "text/markdown" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name + ".md";
        a.click();
    });

    // Delete file
    deleteBtn.addEventListener("click", () => {
        editor.value = "";
        preview.innerHTML = "";
        localStorage.removeItem("markdownContent");
    });
});
