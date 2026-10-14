# 💼 Alfiya Patil — Full-Stack Developer Portfolio

A professional, modern, and responsive developer portfolio website designed to attract international freelance clients. Built with **HTML5**, **CSS3**, **Vanilla JavaScript**, and an optional **Python Flask** backend.

---

## 🌟 Key Features

- **Client-Centric Dark Theme**: High-contrast, sleek slate and midnight aesthetic with restrained cyan, violet, and emerald accents.
- **100% Mobile & Tablet Responsive**: Custom responsive breakpoints, touch-friendly navigation, and mobile drawer menu.
- **Genuine Project Portfolio**: Real, verified projects directly from Alfiya Patil's GitHub (`RapidAid`, `AgriGenie-AI`, `ResumeBuilder`, `Student Admin Portal`, `FAQ Chatbot`, and `Bank Loan Predictor`).
- **Interactive Freelance Inquiries**: Form validation with client-side feedback, inquiry category selectors, and one-click email copy utility.
- **Zero Paid Dependencies**: Pure semantic HTML5, Vanilla CSS3 tokens, Vanilla JavaScript, and native SVG icons without third-party frameworks or paid libraries.
- **Dual Architecture**:
  - Deployable as a **pure static website** (GitHub Pages, Netlify, Vercel)
  - OR runnable with a **Python Flask backend** with an automated `/api/contact` inquiry logger.

---

## 📁 Project Structure

```
Alfiyaportfolio/
├── index.html                 # Main semantic HTML5 portfolio document
├── css/
│   └── style.css              # Custom CSS design system, dark theme & responsive utilities
├── js/
│   └── main.js                # Vanilla JavaScript interactions, filters, form & animations
├── assets/
│   └── images/                # High-resolution screenshots and profile avatar
│       ├── avatar.jpg         # Professional developer portrait
│       ├── project-rapidaid.jpg       # RapidAid Emergency AI Assistant UI
│       ├── project-agrigenie.jpg      # AgriGenie Smart Farming UI
│       ├── project-resumebuilder.jpg  # ResumeBuilder & PDF Generator UI
│       └── project-adminportal.jpg    # Student & Administration Portal UI
├── app.py                     # Optional Python Flask backend & API endpoint
├── requirements.txt           # Python dependency specification (Flask)
├── .gitignore                 # Standard git ignore rules
└── README.md                  # Comprehensive setup & deployment guide
```

---

## 🚀 How to Run Locally

You can run this project in two ways:

### Option A: Using Python Flask (Recommended for Full-Stack)

1. **Install Flask** (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application**:
   ```bash
   python app.py
   ```

3. **Open in your browser**:
   Navigate to [http://127.0.0.1:5000](http://127.0.0.1:5000).

When clients submit the contact form, inquiries will be saved locally to `inquiries.json`.

---

### Option B: Using Python's Built-In HTTP Server (Zero Install)

No dependencies required:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in any browser.

---

### Option C: Direct File Opening

You can double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari without running any server commands.

---

## 🌐 How to Deploy for Free

### 1. GitHub Pages (100% Free Static Hosting)

Because the portfolio is built with pure HTML, CSS, and JS, you can host it for free on your own GitHub account:

1. Create a new GitHub repository named `Alfiyapatil19.github.io` (or `portfolio`).
2. Push your files to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/Alfiyapatil19/<repo-name>.git
   git push -u origin main
   ```
3. Go to your repository on GitHub &rarr; **Settings** &rarr; **Pages**.
4. Under **Branch**, select `main` and root `/`, then click **Save**.
5. Your portfolio will be live at `https://alfiyapatil19.github.io/` within 2 minutes!

---

### 2. Vercel (100% Free with Automatic CI/CD)

1. Sign up for free at [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New Project** &rarr; select your portfolio repository.
3. Keep default settings and click **Deploy**.
4. You will receive a live URL like `https://alfiya-patil-portfolio.vercel.app` with free SSL and global CDN.

---

### 3. Netlify (100% Free Drag-and-Drop or Git)

1. Go to [netlify.com](https://www.netlify.com).
2. Either connect your GitHub repo or drag the folder directly into Netlify Drop.
3. Netlify will deploy it instantly with custom domain support.

---

### 4. Render (Free Python Flask Backend Hosting)

If you want the Flask backend running online for receiving `/api/contact` requests:

1. Push the code to GitHub.
2. Sign up at [render.com](https://render.com) and click **New Web Service**.
3. Select your repository.
4. Set:
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (or `python app.py`)
5. Click **Create Web Service**. Render provides free hosting with automatic HTTPS.

---

## ✏️ Customization Checklist

- [x] **Email Address**: Configured to `patilalfiya1@gmail.com` in `index.html` and `js/main.js`.
- [x] **LinkedIn URL**: Your LinkedIn link is currently set to `https://www.linkedin.com/in/alfiya-patil/`.
- [x] **GitHub URL**: Your GitHub link is set to `https://github.com/Alfiyapatil19`.
- [x] **Resume Modal**: Interactive resume and credentials modal with PDF export and direct contact links.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
