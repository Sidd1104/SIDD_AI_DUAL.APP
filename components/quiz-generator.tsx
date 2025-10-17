"use client"

import { useState } from "react"

interface QuizGeneratorProps {
  onBack: () => void
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function QuizGenerator({ onBack }: QuizGeneratorProps) {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [numQuestions, setNumQuestions] = useState(5)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set())
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const generateQuestions = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    setLoading(true)
    setError("")
    try {
      console.log("[v0] Sending quiz generation request for topic:", topic)

      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          count: numQuestions,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] API error response:", data)
        setError(data.error || "Failed to generate questions. Please try again.")
        return
      }

      if (!data.questions || data.questions.length === 0) {
        console.error("[v0] No questions in response:", data)
        setError("No questions found in response. Please try again.")
        return
      }

      console.log("[v0] Quiz questions generated successfully, count:", data.questions.length)

      setQuestions(data.questions)
      setSelectedAnswers(new Array(data.questions.length).fill(null))
      setSubmittedAnswers(new Set())
      setCurrentQuestionIndex(0)
      setScore(0)
      setQuizCompleted(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error("[v0] Quiz generation error:", errorMessage)
      setError(`Error: ${errorMessage}. Please check your API configuration.`)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (optionIndex: number) => {
    if (submittedAnswers.has(currentQuestionIndex)) return

    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestionIndex] = optionIndex
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswers[currentQuestionIndex] === null) {
      setError("Please select an answer")
      return
    }

    const newSubmittedAnswers = new Set(submittedAnswers)
    newSubmittedAnswers.add(currentQuestionIndex)
    setSubmittedAnswers(newSubmittedAnswers)

    if (selectedAnswers[currentQuestionIndex] === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setError("")
    } else {
      setQuizCompleted(true)
    }
  }

  const resetQuiz = () => {
    setQuestions([])
    setTopic("")
    setSelectedAnswers([])
    setSubmittedAnswers(new Set())
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizCompleted(false)
    setError("")
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 px-4 py-2 text-red-300 hover:text-red-100 transition-colors flex items-center gap-2 group hover:scale-105 hover:-translate-x-1 duration-300"
        >
          <span className="inline-block group-hover:-translate-x-1 transition-transform duration-300">←</span>
          Back to Home
        </button>

        <div className="space-y-8 animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Quiz Question Generator
            </h1>
            <p className="text-red-200/70">Create engaging quiz questions on any topic</p>
          </div>

          {questions.length === 0 ? (
            <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-red-200 font-medium mb-2">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., World War II, Photosynthesis, Python Programming"
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-red-500/30 text-white placeholder-red-200/40 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-red-200 font-medium mb-2">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-red-500/30 text-white focus:outline-none focus:border-red-500 transition-colors"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-red-200 font-medium mb-2">Number of Questions</label>
                    <input
                      type="number"
                      min="5"
                      max="12"
                      value={numQuestions}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 5
                        setNumQuestions(Math.max(5, Math.min(12, value)))
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-red-500/30 text-white focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <p className="text-xs text-red-200/50 mt-1">Minimum 5, Maximum 12 questions</p>
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
                    {error}
                  </div>
                )}

                <button
                  onClick={generateQuestions}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-red-500/50 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">{loading ? "Generating Questions..." : "Generate Quiz"}</span>
                </button>
              </div>
            </div>
          ) : quizCompleted ? (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {score}/{questions.length}
                </div>
                <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
                <p className="text-red-200/70">
                  {score === questions.length
                    ? "Perfect score! You're a master! 🎉"
                    : score >= questions.length * 0.7
                      ? "Great job! You did well! 👏"
                      : score >= questions.length * 0.5
                        ? "Good effort! Keep practicing! 💪"
                        : "Keep learning! You'll improve! 📚"}
                </p>
              </div>

              <button
                onClick={resetQuiz}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-red-500/50 hover:scale-102 transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Generate New Quiz</span>
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-red-200/70">
                  <span>
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span>
                    Score: {score}/{questions.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900/50 rounded-full overflow-hidden border border-red-500/20">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div
                key={currentQuestionIndex}
                className="p-6 rounded-xl bg-slate-900/50 border border-red-500/20 space-y-6 animate-fade-in"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                    {currentQuestionIndex + 1}
                  </div>
                  <h3 className="text-white font-semibold text-lg">{questions[currentQuestionIndex].question}</h3>
                </div>

                {/* Answer options */}
                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx
                    const isCorrect = optIdx === questions[currentQuestionIndex].correctAnswer
                    const isSubmitted = submittedAnswers.has(currentQuestionIndex)
                    const isWrong = isSelected && isSubmitted && !isCorrect

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(optIdx)}
                        disabled={isSubmitted}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left hover:scale-102 ${
                          isSubmitted && isCorrect
                            ? "bg-green-500/20 border-green-500/50 text-green-300"
                            : isWrong
                              ? "bg-red-500/20 border-red-500/50 text-red-300"
                              : isSelected
                                ? "bg-red-500/30 border-red-500/50 text-red-100"
                                : "bg-slate-800/30 border-red-500/20 text-red-200 hover:border-red-500/50 hover:bg-slate-800/50 cursor-pointer"
                        } ${isSubmitted ? "cursor-default" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${
                              isSubmitted && isCorrect
                                ? "bg-green-500/30 border-green-500"
                                : isWrong
                                  ? "bg-red-500/30 border-red-500"
                                  : isSelected
                                    ? "bg-red-500/30 border-red-500"
                                    : "border-red-500/30"
                            }`}
                          >
                            {isSubmitted && isCorrect ? "✓" : isWrong ? "✗" : String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {isSubmitted && isCorrect && <span className="text-sm font-semibold">Correct!</span>}
                          {isWrong && <span className="text-sm font-semibold">Wrong</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {submittedAnswers.has(currentQuestionIndex) && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 space-y-2 animate-fade-in">
                    <p className="text-sm font-semibold text-red-300">Explanation:</p>
                    <p className="text-sm text-red-200/80">{questions[currentQuestionIndex].explanation}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-4">
                  {!submittedAnswers.has(currentQuestionIndex) ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswers[currentQuestionIndex] === null}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-red-500/50 hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative">Submit Answer</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-red-500/50 hover:scale-102 transition-all relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative">
                        {currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
