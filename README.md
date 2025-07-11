
# Horizons Export Project (React + Vite + Tailwind)

This is a React-based project built with **Vite** and styled using **Tailwind CSS**.

---

## 🚀 How to Run This Project (Beginner Friendly)

### ✅ Step 1: Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download and install the **LTS version** (green button)
3. Restart your computer (optional but recommended)
4. Open **Command Prompt** and check installation:

```
node -v
npm -v
```

---

### ✅ Step 2: Extract the Project

1. Right-click on the ZIP file
2. Click **Extract All…**
3. Choose a folder (e.g., `C:\Users\YourName\Documents\my-project`)

---

### ✅ Step 3: Install Project Dependencies

1. Open **PowerShell** in the project folder:
   - Shift + Right Click → “Open PowerShell window here”
2. Run this command to install packages:

```bash
npm install
```

> ⚠ If you get a script error like “running scripts is disabled”, run this in **Administrator PowerShell**:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then rerun `npm install`.

---

### ✅ Step 4: Start the App

Run the development server:

```bash
npm run dev
```

You will see output like:

```
VITE v4.x.x ready in 500ms
➜  Local: http://localhost:5173/
```

---

### ✅ Step 5: View the App

1. Copy the link `http://localhost:5173/`
2. Open it in your browser
3. You should see your project running 🎉

---

## 📂 Project Structure

- `src/` – React components and main code
- `index.html` – Main entry point
- `vite.config.js` – Vite config
- `tailwind.config.js` – Tailwind setup
- `package.json` – Project dependencies

---

## ✅ Optional Commands

- Fix known issues:
  ```
  npm audit fix
  ```
- Force fix (may break things):
  ```
  npm audit fix --force
  ```

---

## 💡 Tips

- Use [Visual Studio Code](https://code.visualstudio.com) for easy code editing
- Open VS Code in your folder and use terminal: `Ctrl + ~`
- You can always rerun the server with `npm run dev`

---

Made for beginners! 🙂
