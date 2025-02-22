# 🚀 AI-Powered Lesson Planner  

> **An interactive AI-powered lesson planning tool for modern educators.**  
> Built with **Next.js, TypeScript, TailwindCSS, ShadCN, and Google Gemini AI.**  

---

## 📌 Features  
✅ **AI-Generated Lesson Plans** (Google Gemini API)  
✅ **Editable Lesson Plans** with Markdown support  
✅ **Print / Save as PDF** functionality  
✅ **Dialog with Edit, Delete, and Print Options**  
✅ **Fully Responsive** with Framer Motion Animations  
✅ **User Authentication** using a `withAuth` Wrapper  

---

## 🛠️ Tech Stack  
- **Frontend:** Next.js (App Router) + TypeScript  
- **Styling:** TailwindCSS + ShadCN  
- **Animations:** Framer Motion  
- **State Management:** React Hooks  
- **API Integration:** Google Gemini AI  
- **PDF Generation:** `react-to-print`  
- **Storage:** LocalStorage (History)  

---
## 🔧 Setup Instructions  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/your-username/ai-lesson-planner.git
cd ai-lesson-planner
```
### 2️⃣ Install dependencies 
Create a `.env.local` file in the root directory and add:  

```ini
npm install
# OR
yarn install
```
### 3️⃣ Setup Environment Variables  


```ini
NEXT_PUBLIC_GEMINI_API=your_google_gemini_api_key
```
### 4️⃣ Run the app  
Create a `.env.local` file in the root directory and add:  

```ini
npm run dev
```
---
The project will be available at http://localhost:3000
---
## 🔗 API Integration  
This project uses the **Google Gemini API** to generate lesson plans dynamically.  

### 🔹 How the API Works  
1. The app sends a structured prompt containing lesson details to **Gemini AI**.  
2. **Gemini API** generates a structured lesson plan based on the input.  
3. The response is stored locally and displayed in **Markdown format**.  

### 🔹 Code Snippet for API Call  

```ts
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;
const genAI = new GoogleGenerativeAI(API_KEY!);

const generateLessonPlan = async () => {
  setLoading(true);
  setGeneratedContent("");
  setEditableContent("");
  setIsEditing(false);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const prompt = `Create a structured lesson plan with the following details:\n
    - Topic: ${formData.topic}
    - Grade Level: ${formData.gradeLevel}
    - Main Concept & Subtopics: ${formData.mainConcept}
    - Materials Needed: ${formData.materials}
    - Learning Objectives: ${formData.objectives}
    - Lesson Outline: ${formData.lessonOutline}`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    setGeneratedContent(response);
    setEditableContent(response);
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    setGeneratedContent("Error fetching lesson plan.");
  } finally {
    setLoading(false);
  }
};

```

## 🔍 How It Works  

1️⃣ **Enter Lesson Details** (Topic, Grade Level, Objectives, etc.)  
2️⃣ **Click "Generate Lesson Plan"** – AI generates a structured plan  
3️⃣ **Edit the Lesson Plan** (Markdown support)  
4️⃣ **Save or Print the Plan**  



## 📦 Dependencies  

| Package                | Purpose                              |
|------------------------|--------------------------------------|
| `next`                | React framework for SSR             |
| `react`               | UI library                          |
| `tailwindcss`         | Utility-first CSS framework        |
| `shadcn/ui`           | Pre-built UI components            |
| `framer-motion`       | Animations                         |
| `react-markdown`      | Markdown rendering                 |
| `google-generative-ai` | Gemini API integration             |
| `jsPdf`      | Print & save as PDF                |


