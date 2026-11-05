import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { courseQuizzesQuery, myQuizAttemptsQuery } from "@/lib/learning";

type Result = { score: number; passed: boolean; correct: number; total: number; completed: boolean };

export function StudentQuizzes({ slug }: { slug: string }) {
  const { data: quizzes } = useSuspenseQuery(courseQuizzesQuery(slug));
  const { data: attempts } = useSuspenseQuery(myQuizAttemptsQuery);
  const [open, setOpen] = useState<string | null>(null);
  if (!quizzes.length) return null;
  return <div className="mt-12">
    <h2 className="text-2xl font-bold text-primary">Assessment quizzes</h2>
    <p className="mt-1 text-sm text-muted-foreground">Pass every required quiz to complete this course.</p>
    <div className="mt-4 space-y-3">
      {quizzes.map((q) => {
        const best = attempts.filter((a) => a.quiz_id === q.id).reduce<number | null>((m, a) => Math.max(m ?? 0, a.score), null);
        const passed = attempts.some((a) => a.quiz_id === q.id && a.passed);
        return <div key={q.id} className="rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold">{q.title} <span className="text-sm font-normal text-muted-foreground">· pass {q.pass_percent}%{q.required ? "" : " · optional"}{best !== null && ` · best ${best}%`}{passed && " · Passed ✓"}</span></p>
            <Button size="sm" variant={passed ? "outline" : "default"} onClick={() => setOpen(open === q.id ? null : q.id)}>{open === q.id ? "Close" : passed ? "Retake" : "Start quiz"}</Button>
          </div>
          {open === q.id && <QuizForm quizId={q.id} questions={q.quiz_questions} />}
        </div>;
      })}
    </div>
  </div>;
}

function QuizForm({ quizId, questions }: { quizId: string; questions: { id: string; prompt: string; options: string[] }[] }) {
  const qc = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  async function submit() {
    setError("");
    if (Object.keys(answers).length < questions.length) return setError("Please answer every question.");
    const { data, error } = await supabase.rpc("submit_quiz", { _quiz_id: quizId, _answers: answers });
    if (error) return setError("Your answers could not be submitted. Please try again.");
    setResult(data as unknown as Result);
    await Promise.all([qc.invalidateQueries({ queryKey: ["my-quiz-attempts"] }), qc.invalidateQueries({ queryKey: ["my-enrollments"] }), qc.invalidateQueries({ queryKey: ["student-dashboard"] })]);
  }
  if (!questions.length) return <p className="mt-3 text-sm text-muted-foreground">This quiz has no questions yet.</p>;
  if (result) return <div role="status" className="mt-3 rounded-lg bg-secondary p-3 text-sm">
    You scored {result.score}% ({result.correct}/{result.total}). {result.passed ? "Passed!" : "Not passed yet — try again."}
    {result.completed && <strong className="block text-accent">Congratulations — you completed this course!</strong>}
    <Button size="sm" variant="outline" className="mt-2" onClick={() => { setResult(null); setAnswers({}); }}>Try again</Button>
  </div>;
  return <div className="mt-3 space-y-4">
    {questions.map((q, i) => <fieldset key={q.id}>
      <legend className="font-medium">{i + 1}. {q.prompt}</legend>
      <div className="mt-1 space-y-1">
        {q.options.map((o, j) => <label key={j} className="flex items-center gap-2 text-sm"><input type="radio" name={q.id} checked={answers[q.id] === j} onChange={() => setAnswers({ ...answers, [q.id]: j })} />{o}</label>)}
      </div>
    </fieldset>)}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button onClick={submit}>Submit answers</Button>
  </div>;
}
