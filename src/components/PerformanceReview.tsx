import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";

/**Testing some comment*/

emailjs.init('w4atMqhypPAGA2UZ_');
const bakerQuestions = [
  "Efficiency & Productivity",
  "Quality of Work",
  "Attention to Detail",
  "Collaboration",
  "Communication",
  "Reliability",
  "Work Ethic",
  "Adaptability",
  "Professionalism",
  "Cleanliness",
  "Compliance with Health & Safety",
];

const fohQuestions = [
  "Efficiency & Productivity",
  "Quality of Work",
  "Customer Service",
  "Attention to Detail",
  "Collaboration",
  "Communication",
  "Reliability",
  "Work Ethic",
  "Adaptability",
  "Professionalism",
  "Store Presentation",
  "Compliance with Health & Safety",
];

const PerformanceReview = ({ formAnswers }: { formAnswers: number[] }) => {
  const [role, setRole] = useState("FOH");
  const questions = role === "FOH" ? fohQuestions : bakerQuestions;
  const [scores, setScores] = useState<number[]>(
    formAnswers.length ? formAnswers : Array(questions.length).fill(3)
  );
  const [notes, setNotes] = useState(" ");
  const [email, setEmail] = useState(" ");
  const [name, setName] = useState(" "); // State for employee name
  const [comments, setComments] = useState<string[]>(Array(questions.length).fill(""));
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (formAnswers.length) {
      setScores(formAnswers);
    }
  }, [formAnswers]);

  useEffect(() => {
    setScores(Array(questions.length).fill(3));
    setComments(Array(questions.length).fill(""));
  }, [role]);

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const handleCommentChange = (index: number, value: string) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const calculateAverage = () => {
    const total = scores.reduce((acc, score) => acc + score, 0);
    return (total / scores.length).toFixed(2);
  };

  const getRaiseTier = () => {
    const avg = parseFloat(calculateAverage());
    if (avg < 3) return "1% Raise";
    if (avg < 3.6) return "2% Raise";
    if (avg < 4.5) return "3% Raise";
    return "4% Raise";
  };

  const sendEmail = () => {
    const scoresDetails = questions.map((q, index) => ({
      question: q,
      score: scores[index],
      comment: comments[index] || "No comment",
    }));
  
    const templateParams = {
      email,
      name,
      average_score: calculateAverage(),
      raise_tier: getRaiseTier(),
      notes,
      scores: scoresDetails,
    };
  
    emailjs.send('service_jld4m9s', 'template_vmk8ygo', templateParams)
      .then(response => {
        console.log('SUCCESS!', response.status, response.text);
        setSuccessMessage("Review sent successfully!");
        setTimeout(() => {
            setSuccessMessage(""); // Hide the success message after 3 seconds
          }, 3000);
      })
      .catch(error => {
        console.log('FAILED...', error);
        setSuccessMessage("Failed to send the review. Please try again.");
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Performance Review</h2>
      <p className="mb-4">Below are the review questions along with pre-filled responses from the self-reflection form.</p>
      <div className="mb-3">
        <label className="block text-sm font-medium">Employee Name</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter employee's name"
        />
      </div>
      <label className="block text-sm font-medium">Select Role</label>
      <select
        className="border p-2 w-full mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="FOH">FOH</option>
        <option value="Baker">Baker</option>
      </select>
      {questions.map((q, index) => (
        <div key={index} className="mb-3">
          <label className="block text-sm font-medium">{q}</label>
          <select
            className="border p-2 w-full"
            value={scores[index]}
            onChange={(e) => handleScoreChange(index, Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <textarea
            className="border p-2 w-full mt-2"
            rows={2}
            placeholder="Add comments..."
            value={comments[index]}
            onChange={(e) => handleCommentChange(index, e.target.value)}
          />
        </div>
      ))}
      <div className="mb-3">
        <label className="block text-sm font-medium">Additional Notes</label>
        <textarea
          className="border p-2 w-full"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Send to Email</label>
        <input
          type="email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <p className="font-semibold">Final Score: {calculateAverage()}</p>
      <p className="font-semibold">Raise Tier: {getRaiseTier()}</p>
      <button onClick={sendEmail} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Send Review</button>
      {successMessage && (
  <div className="mt-4 p-2 bg-green-100 text-green-800 border border-green-200 rounded">
    {successMessage}
  </div>
)}
    </div>
  );
};

export default PerformanceReview;
