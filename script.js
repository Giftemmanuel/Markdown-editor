console.log("Script loaded successfully!");

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
    const fileList = document.getElementById("file-list");
    const newDocBtn = document.getElementById("new-doc");

    // Default Markdown content
    const defaultMarkdown = `# Welcome to Markdown

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents.

## How to use this?

1. Write markdown in the markdown editor window
2. See the rendered markdown in the preview window

### Features

- Create headings, paragraphs, links, blockquotes, inline-code, code blocks, and lists
- Name and save the document to access again later
- Choose between Light or Dark mode depending on your preference

> This is an example of a blockquote. If you would like to learn more about markdown syntax, you can visit this [markdown cheatsheet](https://www.markdownguide.org/cheat-sheet/).

#### Headings

To create a heading, add the hash sign (\#) before the heading. The number of number signs you use should correspond to the heading level.

#### Lists

You can see examples of ordered and unordered lists above.

##### Code Blocks

This markdown editor allows for inline-code snippets, like this: \`<p>I'm inline</p>\`. It also allows for larger code blocks like this:

\`\`\`html
<main>
    <h1>This is a larger code block</h1>
</main>
\`\`\`
`;

    // Load saved files from localStorage
    let storedFiles = JSON.parse(localStorage.getItem("savedFiles")) || [];

    // Load last edited document or default content
    let activeFile = localStorage.getItem("activeFile") || "welcome.md";
    let activeContent = storedFiles.find(file => file.name === activeFile)?.content || defaultMarkdown;
    editor.value = activeContent;
    preview.innerHTML = marked.parse(editor.value);
    docName.value = activeFile;

    // Update sidebar file list
    function updateFileList() {
        fileList.innerHTML = "";
        storedFiles.forEach(file => {
            const option = document.createElement("option");
            option.value = file.name;
            option.textContent = file.name;
            fileList.appendChild(option);
        });
        fileList.value = activeFile;
    }
    updateFileList();

    // Markdown rendering on input
    editor.addEventListener("input", () => {
        preview.innerHTML = marked.parse(editor.value);
        localStorage.setItem("markdownContent", editor.value);
        
        // Save changes to active file
        const fileIndex = storedFiles.findIndex(file => file.name === activeFile);
        if (fileIndex !== -1) {
            storedFiles[fileIndex].content = editor.value;
            localStorage.setItem("savedFiles", JSON.stringify(storedFiles));
        }
    });

    // Toggle dark mode
    toggleMode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
    });

    // Load dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    // Save markdown content as file
    saveBtn.addEventListener("click", () => {
        const content = editor.value;
        const name = docName.value.trim() || "Untitled";
        const blob = new Blob([content], { type: "text/markdown" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name + ".md";
        a.click();

        // Save file in localStorage
        const existingFileIndex = storedFiles.findIndex(file => file.name === name);
        if (existingFileIndex !== -1) {
            storedFiles[existingFileIndex].content = content;
        } else {
            storedFiles.push({ name, content });
        }
        localStorage.setItem("savedFiles", JSON.stringify(storedFiles));
        localStorage.setItem("activeFile", name);
        activeFile = name;

        updateFileList();
    });

    // Delete active file
    deleteBtn.addEventListener("click", () => {
        storedFiles = storedFiles.filter(file => file.name !== activeFile);
        localStorage.setItem("savedFiles", JSON.stringify(storedFiles));

        editor.value = "";
        preview.innerHTML = "";
        localStorage.removeItem("markdownContent");

        // Reset active file
        activeFile = "welcome.md";
        docName.value = activeFile;
        updateFileList();
    });

    // Open Sidebar
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
    });

    // Close Sidebar
    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    // Load selected file from the sidebar
    fileList.addEventListener("change", () => {
        const selectedFile = storedFiles.find(file => file.name === fileList.value);
        if (selectedFile) {
            editor.value = selectedFile.content;
            preview.innerHTML = marked.parse(editor.value);
            docName.value = selectedFile.name;
            activeFile = selectedFile.name;
            localStorage.setItem("activeFile", activeFile);
        }
    });

    // Create new document
    newDocBtn.addEventListener("click", () => {
        const newFileName = prompt("Enter new file name:", "new-document.md");
        if (!newFileName) return;

        if (storedFiles.some(file => file.name === newFileName)) {
            alert("A file with this name already exists!");
            return;
        }

        const newFile = { name: newFileName, content: "" };
        storedFiles.push(newFile);
        localStorage.setItem("savedFiles", JSON.stringify(storedFiles));

        activeFile = newFileName;
        docName.value = newFileName;
        editor.value = "";
        preview.innerHTML = "";
        localStorage.setItem("activeFile", newFileName);

        updateFileList();
    });
});
