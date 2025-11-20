# Student Risk Analysis and Intervention System

A complete end‑to‑end system combining **React + Node.js + MongoDB + FastAPI + Gemini AI**  
to provide **student performance analytics, AI‑powered study support, automated mentor assignment, and syllabus‑aware chat.**

# 🚀 Backend Setup (Node.js + MongoDB)

### **Step 1 — Navigate to the backend folder**

```sh
cd backend
```

### **Step 2 — Install dependencies**

```sh
npm install
```

### **Step 3 — Create `.env` file**

```
MONGO_URI=
JWT_SECRET=
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=
```

### **Step 4 — Start the backend**

```sh
npm run dev
```

---

# 🎨 Frontend Setup (React + Vite + Tailwind)

### **Step 1 — Navigate to frontend**

```sh
cd frontend
```

### **Step 2 — Install dependencies**

```sh
npm install
```

### **Step 3 — Create `.env` file**

```
VITE_API_URL=http://localhost:5000
VITE_ML_SERVER_URL=http://localhost:8000
```

### **Step 4 — Start frontend**

```sh
npm run dev
```

---

# 🤖 ML Backend Setup (FastAPI + Gemini + OCR + Syllabus RAG)

### **Step 1 — Navigate to ML backend**

```sh
cd ML-Backend
```

### **Step 2 — Create virtual environment**

```sh
python -m venv venv
```

### **Step 3 — Activate venv**

#### Windows:

```sh
venv\Scripts\activate
```

#### macOS / Linux:

```sh
source venv/bin/activate
```

### **Step 4 — Install dependencies**

```sh
pip install -r requirements.txt
```

### **Step 5 — Create `.env`**

```
MONGODB_URI=
MONGODB_DB=student_risk_db
MONGODB_COLLECTION=student_risks

TESSERACT_CMD="C:\Program Files\Tesseract-OCR\tesseract.exe"

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
EMBED_MODEL=BAAI/bge-small-en-v1.5
SYLLABUS_API_BASE_URL=http://127.0.0.1:8000
```

### **Step 6 — Start ML backend**

```sh
uvicorn app.main:app --reload
```

---

# 🎯 Key Features

### ✅ Student module

-   View academic performance
-   Personalized AI study plan
-   Request mentor
-   AI syllabus‑aware chat widget

### ✅ Teacher module

-   Upload marks
-   Manage syllabus PDFs
-   View assigned students
-   AI‑powered suggestions

### ✅ Admin module

-   Create/delete users
-   Mentor‑student mapping
-   Approve mentor requests

### ✅ AI System

-   Gemini‑powered study chat
-   RAG on syllabus PDF
-   OCR for PDF text extraction
-   Risk prediction ML model
