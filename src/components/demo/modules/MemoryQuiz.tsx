"use client";

import { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import type { DemoQuizQuestion } from "@/data/demoContent";
import { isDarkHex } from "@/lib/color";

interface MemoryQuizProps {
  questions: DemoQuizQuestion[];
  accent: string;
  soft: string;
}

export function MemoryQuiz({ questions, accent, soft }: MemoryQuizProps) {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const darkAccent = isDarkHex(accent);
  const current = questions[step];

  const handleChoose = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === current.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (step + 1 >= questions.length) {
      setFinished(true);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  if (finished) {
    return (
      <div
        className="rounded-[24px] border p-6 text-center"
        style={{ backgroundColor: "#FFFFFF", borderColor: `${accent}44`, color: "#18181D" }}
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: soft, color: accent }}
        >
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-xl font-bold text-[#18181D]">
          Kuis Selesai! Skor Kamu {score} / {questions.length}
        </h3>
        <p className="mt-1.5 text-sm text-[#4F4B58]">
          Berapa pun skornya, hadiah rahasia di bawah tetap terbuka khusus buat kamu!
        </p>
        <button
          type="button"
          onClick={() => {
            setStep(0);
            setScore(0);
            setSelectedOption(null);
            setFinished(false);
          }}
          className="mt-4 inline-flex h-10 items-center rounded-full border px-4 text-xs font-semibold"
          style={{ borderColor: `${accent}55`, color: accent }}
        >
          Mainkan kuis lagi
        </button>
      </div>
    );
  }

  return (
    <div
      className="rounded-[24px] border p-6"
      style={{ backgroundColor: "#FFFFFF", borderColor: `${accent}44`, color: "#18181D" }}
    >
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5" style={{ color: accent }}>
          <HelpCircle className="h-4 w-4" />
          Kuis Kenangan · Soal {step + 1} dari {questions.length}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold text-[#18181D]">{current.question}</h3>

      <div className="mt-4 space-y-2.5">
        {current.options.map((opt, idx) => {
          const chosen = selectedOption === idx;
          const isCorrect = idx === current.correctIndex;
          let bg = "#FAF9F6";
          let border = "#E2DFD7";

          if (selectedOption !== null) {
            if (isCorrect) {
              bg = "#E6F2EC";
              border = "#157347";
            } else if (chosen) {
              bg = "#FDECEE";
              border = "#B4233C";
            }
          }

          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleChoose(idx)}
              className="flex min-h-[46px] w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left text-sm font-medium text-[#18181D] transition-colors"
              style={{ backgroundColor: bg, borderColor: border }}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl p-3.5 sm:flex-row sm:items-center" style={{ backgroundColor: soft }}>
          <p className="text-xs font-medium text-[#18181D]">
            {selectedOption === current.correctIndex
              ? current.correctFeedback
              : current.wrongFeedback}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-9 shrink-0 items-center rounded-full px-4 text-xs font-semibold"
            style={{ backgroundColor: accent, color: darkAccent ? "#FFFFFF" : "#18181D" }}
          >
            {step + 1 >= questions.length ? "Lihat Hasil" : "Lanjut →"}
          </button>
        </div>
      )}
    </div>
  );
}
