import terms from "./terms.json";
import chapters from "./chapters.json";
import diagrams from "./diagrams.json";
import quiz from "./quiz.json";

export { terms, chapters, quiz };
export type Term = (typeof terms)[number];
export type Chapter = (typeof chapters)[number];
export type Question = (typeof quiz)[number];
export const diagramByChapter: Partial<Record<number, (typeof diagrams)["1"]>> =
  diagrams;
export const termById = new Map(terms.map((term) => [term.id, term]));
export const categories = [...new Set(terms.map((term) => term.category))];
export const art = (id: string) =>
  import.meta.env.BASE_URL + "art/" + id + ".webp";
export const num = (n: number) => String(n).padStart(2, "0");
export const checkpoints: Record<number, string> = {
  2: "emperor",
  3: "plan",
  4: "names",
  5: "nav",
  6: "rhythm",
  7: "suit",
};
export const finalQuestions = [
  "emperor",
  "roles",
  "nav",
  "ecology",
  "mind",
  "last",
].map((id) => quiz.find((q) => q.id === id)!);
export const normalize = (value: string) =>
  value
    .toLocaleLowerCase("ru")
    .replaceAll("ё", "е")
    .replace(/[’'ʼ‐‑–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
export function findTerms(query: string, category: string) {
  const words = normalize(query).split(" ").filter(Boolean);
  return terms
    .filter((term) => category === "Все" || term.category === category)
    .map((term) => {
      const names = normalize([term.name, ...term.aliases].join(" "));
      const context = normalize(
        [
          term.brief,
          term.detail,
          term.story,
          term.category,
          ...term.related.map((id) => termById.get(id)?.name),
        ].join(" "),
      );
      return {
        term,
        score: words.reduce(
          (sum, word) =>
            sum +
            (names.includes(word) ? 4 : context.includes(word) ? 1 : -100),
          0,
        ),
      };
    })
    .filter((hit) => hit.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((hit) => hit.term);
}
