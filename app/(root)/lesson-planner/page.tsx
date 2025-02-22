"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import withAuth from "@/Provider/withAuth";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const formFields = [
  { id: 'topic', label: 'Topic' },
  { id: 'gradeLevel', label: 'Grade Level' },
  { id: 'mainConcept', label: 'Main Concept & Subtopics' },
  { id: 'materials', label: 'Materials Needed' },
  { id: 'objectives', label: 'Learning Objectives' },
  { id: 'lessonOutline', label: 'Lesson Outline' },
] as const;

type FormData = {
  [K in typeof formFields[number]['id']]: string;
};
function LessonPlanner() {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    gradeLevel: "",
    mainConcept: "",
    materials: "",
    objectives: "",
    lessonOutline: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [editableContent, setEditableContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;
  const genAI = new GoogleGenerativeAI(API_KEY!);

  const generateLessonPlan = async () => {
    setLoading(true);
    setGeneratedContent("");
    setEditableContent("");
    setIsEditing(false);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
      const prompt = `Create a structured lesson plan that should contain Detailed lesson content, Suggested classroom activities, Assessment questions with the following details:\n
      - Topic: ${formData.topic}\n
      - Grade Level: ${formData.gradeLevel}\n
      - Main Concept & Subtopics: ${formData.mainConcept}\n
      - Materials Needed: ${formData.materials}\n
      - Learning Objectives: ${formData.objectives}\n
      - Lesson Outline: ${formData.lessonOutline}
      
      Ensure that sections such as Topic, Grade Level, Main Concept & Subtopics,
Materials Needed, Learning Objectives, Lesson Outline, and Assessment
are properly structured`;

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
 
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("LESSON PLAN", 90, 15);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let y = 30;

    // Lesson Details
    doc.text(`Topic: ${formData.topic || "Not provided"}`, 10, 30);
    doc.text(`Grade Level: ${formData.gradeLevel || "Not provided"}`, 10, 40);
    doc.text(`Main Concept: ${formData.mainConcept || "Not provided"}`, 10, 50);
    doc.text(`Materials Needed:`, 10, 60);
    doc.text(formData.materials || "Not provided", 10, 70);

    // Learning Objectives
    doc.setFont("helvetica", "bold");
    doc.text("Learning Objectives:", 10, 80);
    doc.setFont("helvetica", "normal");
    doc.text(formData.objectives || "Not provided", 10, 90);

    // Lesson Outline Table
    doc.setFont("helvetica", "bold");
    doc.text("Lesson Outline:", 10, 100);

    // Store the final Y position after the table
    let finalY = 120;
    
    autoTable(doc, {
      startY: 120,
      head: [["Duration", "Guide", "Remarks"]],
      body: [
        ["10 min", "Introduction & Warm-Up", "Brief Overview"],
        ["20 min", "Main Lesson Explanation", "Detailed Concepts"],
        ["15 min", "Activity/Hands-on Work", "Group Activity"],
        ["10 min", "Q&A and Discussion", "Class Participation"],
        ["5 min", "Summary & Homework", "Wrap-up"],
      ],
      theme: "grid",
      didDrawPage: function(data) {
        finalY = data!.cursor!.y;
      }
    });

    y = finalY + 10;

    // AI-Generated Content
    doc.setFont("helvetica", "bold");
    doc.text("AI-Generated Lesson Plan:", 10, y + 10);
    doc.setFont("helvetica", "normal");

    const aiContent = editableContent || "No AI-generated content available";
    const splitText = doc.splitTextToSize(aiContent, 180) as string[];
    
    splitText.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y + 20);
      y += 7;
    });

    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Notes Section
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", 10, doc.internal.pageSize.height - 40);
    doc.setFont("helvetica", "normal");
    doc.text("Include any pre-lesson reminders or post-lesson reflections here.", 10, doc.internal.pageSize.height - 30);

    doc.save("Lesson_Plan.pdf");
};

  return (
    <div className="flex justify-center items-center min-h-screen dark:from-gray-900 dark:to-gray-800 p-6">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="bg-gray-400 rounded-md bg-clip-padding backdrop-filter bg-opacity-90 backdrop-blur-md shadow-lg border border-black text-white dark:text-gray-300">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-black dark:text-white">
              Lesson Planner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-black dark:text-white">
              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Label>{field.label}</Label>
                  <Textarea
                    name={field.id}
                    value={formData[field.id]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label}`}
                    className="border-gray-700 focus:border-indigo-400"
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  onClick={generateLessonPlan}
                  className="w-full dark:text-white bg-indigo-500 hover:bg-indigo-700"
                >
                  Generate Lesson Plan
                </Button>
              </motion.div>
            </div>

            {loading && <Skeleton className="h-10 w-full mt-4 bg-gray-700" />}

            {generatedContent && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {isEditing ? (
                  <>
                    <Textarea
                      value={editableContent}
                      onChange={(e) => setEditableContent(e.target.value)}
                      className="h-64 w-full border border-gray-600 p-2 rounded-md bg-gray-900"
                    />
                    <div className="flex justify-end mt-4 space-x-4">
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="text-white bg-blue-500 hover:bg-blue-700"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        className="text-white bg-gray-700 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <Accordion type="single" collapsible id="lesson-plan">
                    <AccordionItem value="content">
                      <AccordionTrigger className="text-xl font-semibold text-indigo-400">
                        Generated Lesson Plan
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className="text-black dark:text-white prose prose-lg dark:prose-invert"
                          ref={printRef}
                        >
                          <ReactMarkdown>{editableContent}</ReactMarkdown>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="dark:text-white bg-gray-700 hover:bg-gray-800"
                  >
                    {isEditing ? "Cancel Edit" : "Edit"}
                  </Button>
                  <Button
                    onClick={() => handleDownloadPDF()}
                    className="bg-indigo-500 text-white hover:bg-indigo-700"
                  >
                    Print / Save as PDF
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default withAuth(LessonPlanner);
