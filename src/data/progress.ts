import { chapters, finalQuestions, quiz, termById } from "./index";

export interface Progress {
  mode: "films" | "beginner";
  read: number[];
  seen: string[];
  last: number;
  answers: Record<string, number>;
  final: Record<string, number>;
}
const key = "arrakis.fieldguide.v1";
export function readProgress(): Progress {
  const fresh: Progress = {
    mode: "films",
    read: [],
    seen: [],
    last: 1,
    answers: {},
    final: {},
  };
  try {
    const data = JSON.parse(localStorage.getItem(key) || "null");
    if (!data || typeof data !== "object") return fresh;
    const validAnswers = (
      source: Record<string, number> | undefined,
      questions: typeof quiz,
    ) =>
      Object.fromEntries(
        questions
          .filter(
            (q) =>
              Number.isInteger(source?.[q.id]) &&
              q.options[source![q.id]] !== undefined,
          )
          .map((q) => [q.id, source![q.id]]),
      );
    return {
      mode: data.mode === "beginner" ? "beginner" : "films",
      last: chapters.some((c) => c.id === data.last) ? data.last : 1,
      read: chapters
        .map((c) => c.id)
        .filter((id) => Array.isArray(data.read) && data.read.includes(id)),
      seen: [...termById.keys()].filter(
        (id) => Array.isArray(data.seen) && data.seen.includes(id),
      ),
      answers: validAnswers(data.answers, quiz),
      final: validAnswers(data.final, finalQuestions),
    };
  } catch {
    return fresh;
  }
}
export function saveProgress(data: Progress) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* Reading remains available when storage is disabled. */
  }
}
