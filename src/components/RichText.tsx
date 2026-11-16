import { createContext, useContext } from "react";
import { terms } from "../data";

export const OpenTerm = createContext<(id: string) => void>(() => {});
const aliases = new Map<string, string>();
for (const term of terms) {
  for (const word of [term.name, ...term.aliases])
    aliases.set(word.toLocaleLowerCase("ru"), term.id);
}
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = [...aliases.keys()]
  .sort((a, b) => b.length - a.length)
  .map(escape)
  .join("|");
const matcher = new RegExp(
  "(?<![\\p{L}\\p{N}])(" + pattern + ")(?![\\p{L}\\p{N}])",
  "giu",
);
export function RichText({
  text,
  exclude,
}: {
  text: string;
  exclude?: string;
}) {
  const open = useContext(OpenTerm);
  return (
    <>
      {text.split(matcher).map((part, index) => {
        const id =
          index % 2 ? aliases.get(part.toLocaleLowerCase("ru")) : undefined;
        return id && id !== exclude ? (
          <button key={index} className="term" onClick={() => open(id)}>
            {part}
          </button>
        ) : (
          part
        );
      })}
    </>
  );
}
