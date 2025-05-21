import { useState, useEffect } from "react";
import jsPDF from "jspdf";

const bakerQuestions = [
  "Efficiency & Productivity",
  "Quality of Work",
  "Attention to Detail",
  "Cleanliness",
  "Compliance with Health & Safety",
];

const fohQuestions = [
  "Customer Service",
  "Communication",
  "Reliability",
  "Professionalism",
  "Store Presentation",
];

const PerformanceReview = ({ formAnswers }: { formAnswers: number[] }) => {
  const [role, setRole] = useState<"Baker" | "FOH">("Baker");
  const [questions, setQuestions] = useState<string[]>(bakerQuestions);
  const [scores, setScores] = useState<number[]>(
    formAnswers.length ? formAnswers : Array(bakerQuestions.length).fill(3)
  );
  const [notes, setNotes] = useState(" ");
  const [name, setName] = useState(" ");
  const [comments, setComments] = useState<string[]>(
    Array(bakerQuestions.length).fill("")
  );

  useEffect(() => {
    if (role === "Baker") {
      setQuestions(bakerQuestions);
      setScores(Array(bakerQuestions.length).fill(3));
      setComments(Array(bakerQuestions.length).fill(""));
    } else {
      setQuestions(fohQuestions);
      setScores(Array(fohQuestions.length).fill(3));
      setComments(Array(fohQuestions.length).fill(""));
    }
  }, [role]);


  const calculateAverage = () => {
    const total = scores.reduce((acc, score) => acc + score, 0);
    return (total / scores.length).toFixed(2);
  };


  const saveAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Performance Review", 20, 20);

    doc.setFontSize(12);
    doc.text(`Employee Name: ${name}`, 20, 30);
    doc.text(`Average Score: ${calculateAverage()}`, 20, 40);

    let y = 60;
    questions.forEach((q, index) => {
      const score = scores[index];
      const comment = comments[index] || "No comment";
      doc.text(`${q}: ${score} - ${comment}`, 20, y);
      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    if (notes.trim()) {
      doc.text(`Notes: ${notes}`, 20, y + 10);
    }

    doc.save(`${name.replace(/\s+/g, "_")}_review.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <h2 className="text-xl font-bold mb-4 text-center">Performance Review</h2>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Select Role</label>
        <select
          className="border p-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value as "Baker" | "FOH")}
        >
          <option value="Baker">Baker</option>
          <option value="FOH">FOH</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-center">Employee Name</label>
        <div>
        <input
          type="text"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter employee's name"
        />
        </div>
      </div>

      {questions.map((q, index) => (
        <div key={index} className="mb-3">
          <label className="block text-sm font-medium">{q}</label>
          <select
            className="border p-2 w-full"
            value={scores[index]}
            onChange={(e) => {
              const newScores = [...scores];
              newScores[index] = Number(e.target.value);
              setScores(newScores);
            }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <div>
          <textarea
            className="border p-2 w-full mt-2 block"
            rows={2}
            placeholder="Add comments..."
            value={comments[index]}
            onChange={(e) => {
              const newComments = [...comments];
              newComments[index] = e.target.value;
              setComments(newComments);
            }}
          />
          </div>
        </div>
      ))}

      <div className="mb-3">
        <label className="block text-sm font-medium">Additional Notes</label>
        <div>
        <textarea
          className="border p-2 w-full"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        </div>
      </div>

      <p className="font-semibold">Final Score: {calculateAverage()}</p>

      <button
        onClick={saveAsPDF}
        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Save as PDF
      </button>

    </div>
  );
};

export default PerformanceReview;
