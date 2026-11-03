import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { courseQuizzesQuery } from "@/lib/learning";

export function AdminQuizzes({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(courseQuizzesQuery(slug));
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [pass, setPass] = useState("70");
  const [required, setRequired] = useState(true);
  const refresh = () => qc.invalidateQueries({ queryKey: ["course-quizzes", slug] });
  async function add(e: FormEvent) {
    e.preventDefault();
    await supabase.from("course_quizzes").insert({ course_slug: slug, title, pass_percent: Math.min(100, Math.max(0, Number(pass) || 0)), required, position: data.length });
    setTitle(""); await refresh();
  }
  async function remove(id: string) { if (confirm("Delete this quiz and its questions?")) { await supabase.from("course_quizzes").delete().eq("id", id); await refresh(); } }
  return <div className="mt-12">
    <h2 className="text-2xl font-bold text-primary">Assessment quizzes</h2>
    <p className="mt-1 text-sm text-muted-foreground">A student's course is marked Completed once they pass every required quiz.</p>
    <form onSubmit={add} className="mt-4 grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_8rem]">
      <div className="space-y-2"><Label htmlFor="qt">Quiz title</Label><Input id="qt" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="qp">Pass mark (%)</Label><Input id="qp" type="number" min={0} max={100} value={pass} onChange={(e) => setPass(e.target.value)} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} /> Required to complete the course</label>
      <Button type="submit" className="justify-self-start sm:col-span-2">Add quiz</Button>
    </form>
    <div className="mt-4 space-y-4">
      {data.map((q) => <div key={q.id} className="rounded-xl border p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">{q.title} <span className="text-sm font-normal text-muted-foreground">· pass {q.pass_percent}% · {q.required ? "required" : "optional"}</span></p>
          <Button size="sm" variant="outline" onClick={() => remove(q.id)}>Delete quiz</Button>
        </div>
        <Questions quizId={q.id} questions={q.quiz_questions} onChange={refresh} />
      </div>)}
    </div>
  </div>;
}

function Questions({ quizId, questions, onChange }: { quizId: string; questions: { id: string; prompt: string; options: string[] }[]; onChange: () => Promise<void> }) {
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState("");
  async function add(e: FormEvent) {
    e.preventDefault(); setError("");
    const filled = options.map((o) => o.trim()).filter(Boolean);
    if (filled.length < 2) return setError("Add at least two answer choices.");
    const idx = filled.indexOf(options[correct]?.trim() ?? "");
    if (idx < 0) return setError("Pick the correct answer from the filled choices.");
    const { error } = await supabase.from("quiz_questions").insert({ quiz_id: quizId, prompt, options: filled, correct_index: idx, position: questions.length });
    if (error) return setError("The question could not be added.");
    setPrompt(""); setOptions(["", "", "", ""]); setCorrect(0); await onChange();
  }
  async function remove(id: string) { await supabase.from("quiz_questions").delete().eq("id", id); await onChange(); }
  return <>
    <ol className="mt-3 space-y-2 text-sm">
      {questions.map((q, i) => <li key={q.id} className="flex items-start justify-between gap-3 rounded-lg bg-secondary p-3">
        <span>{i + 1}. {q.prompt}<span className="block text-muted-foreground">{q.options.join(" · ")}</span></span>
        <Button size="sm" variant="ghost" onClick={() => remove(q.id)}>Remove</Button>
      </li>)}
    </ol>
    <form onSubmit={add} className="mt-3 grid gap-2">
      <Input required placeholder="New question" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      {options.map((o, i) => <label key={i} className="flex items-center gap-2 text-sm">
        <input type="radio" name={`c-${quizId}`} checked={correct === i} onChange={() => setCorrect(i)} aria-label={`Choice ${i + 1} is correct`} />
        <Input placeholder={`Choice ${i + 1}`} value={o} onChange={(e) => setOptions(options.map((x, j) => j === i ? e.target.value : x))} />
      </label>)}
      <p className="text-xs text-muted-foreground">Select the circle next to the correct answer.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="sm" variant="outline" className="justify-self-start">Add question</Button>
    </form>
  </>;
}
