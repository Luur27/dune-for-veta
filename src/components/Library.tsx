import { useEffect, useRef, useState } from "react";
import { art, categories, findTerms, termById, type Term } from "../data";
import { RichText } from "./RichText";
import { Icon } from "./Icons";

export function Search({
  open,
  active,
}: {
  open: (id: string) => void;
  active: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const hits = findTerms(query, category);
  const input = useRef<HTMLInputElement>(null);
  const lastResult = useRef<HTMLButtonElement | null>(null);
  const resultOffset = useRef(0);
  useEffect(() => {
    if (!active) return;
    const dialog = input.current?.closest("dialog");
    if (dialog) dialog.scrollTop = resultOffset.current;
    (lastResult.current || input.current)?.focus({ preventScroll: true });
  }, [active]);
  return (
    <section hidden={!active}>
      <p className="eyebrow">Полевой справочник</p>
      <h2>Энциклопедия</h2>
      <label className="searchbox">
        <Icon name="search" />
        <input
          ref={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Имя, другое написание или описание…"
          aria-label="Поиск по энциклопедии"
        />
      </label>
      <div className="chips">
        {["Все", ...categories].map((c) => (
          <button
            aria-pressed={category === c}
            key={c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="small" role="status">
        Найдено статей · {hits.length}
      </p>
      <div className="hits">
        {hits.map((t) => (
          <button
            key={t.id}
            onClick={(e) => {
              lastResult.current = e.currentTarget;
              resultOffset.current =
                e.currentTarget.closest("dialog")?.scrollTop ?? 0;
              open(t.id);
            }}
          >
            <img src={art(t.art)} alt="" loading="lazy" />
            <span>
              <b>{t.name}</b>
              <small>{t.brief}</small>
            </span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
      {hits.length === 0 && (
        <p>Попробуй более короткое слово или выбери другую категорию.</p>
      )}
    </section>
  );
}
export function Article({
  term,
  open,
  back,
  backLabel,
}: {
  term: Term;
  open: (id: string) => void;
  back?: () => void;
  backLabel: string;
}) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
    title.current?.closest("dialog")?.scrollTo(0, 0);
  }, [term.id]);
  return (
    <article>
      {back && (
        <button className="textbtn" onClick={back}>
          <Icon name="back" size={16} />
          {backLabel}
        </button>
      )}
      <div
        className={
          "article-top " + (term.category === "Персонажи" ? "portrait" : "")
        }
      >
        <img src={art(term.art)} alt="" />
        <div>
          <p className="eyebrow">{term.category}</p>
          <h2 ref={title} tabIndex={-1}>
            {term.name}
          </h2>
          {term.actor && <small>{term.actor}</small>}
        </div>
      </div>
      <p className="definition">
        <RichText text={term.brief} exclude={term.id} />
      </p>
      <p>
        <RichText text={term.detail} exclude={term.id} />
      </p>
      <h3>В истории Пола</h3>
      <p>
        <RichText text={term.story} exclude={term.id} />
      </p>
      {term.id === "muad" && (
        <p>
          <RichText
            text="Пол Атрейдес — имя при рождении. Муад’Диб — выбранное имя. Усул — имя для своих. Лисан аль-Гаиб и Махди — пророческие обозначения."
            exclude={term.id}
          />
        </p>
      )}
      <h3>Связанные статьи</h3>
      <div className="chips">
        {term.related.map((id) => (
          <button key={id} onClick={() => open(id)}>
            {termById.get(id)!.name} ↗
          </button>
        ))}
      </div>
      <p className="source">
        Источники · {term.sources.join(" · ")}
        {term.stillSource && (
          <> · <a href={term.stillSource} target="_blank" rel="noreferrer">Источник фотографии ↗</a></>
        )}
      </p>
    </article>
  );
}
