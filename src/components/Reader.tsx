import { art, chapters, checkpoints, num, quiz, type Chapter } from "../data";
import type { Progress } from "../data/progress";
import { Diagram } from "./Diagram";
import { RichText } from "./RichText";
import { Icon } from "./Icons";
import { Question } from "./Question";

export function Reader({
  c,
  data,
  finish,
  answer,
  go,
  atlas,
}: {
  c: Chapter;
  data: Progress;
  finish: () => void;
  answer: (id: string, v: number) => void;
  go: (n: number) => void;
  atlas: () => void;
}) {
  const q = quiz.find((q) => q.id === checkpoints[c.id]);
  return (
    <main className="reader shell" id="main">
      <button className="textbtn" onClick={atlas}>
        <Icon name="back" size={16} />К атласу глав
      </button>
      <header className="chapter-head">
        <div>
          <p className="eyebrow">Глава {num(c.id)} / 09</p>
          <h1>{c.title}</h1>
          <p>{c.deck}</p>
        </div>
        <img src={art("chapter-" + c.id)} alt={c.short} />
      </header>
      <div className="reading-layout">
        <aside className="margin-nav">
          <h2>В этом путеводителе</h2>
          {chapters.map((ch) => (
            <button
              aria-current={ch.id === c.id ? "page" : undefined}
              key={ch.id}
              onClick={() => go(ch.id)}
            >
              <span>{num(ch.id)}</span>
              {ch.short}
              {data.read.includes(ch.id) && <Icon name="check" size={14} />}
            </button>
          ))}
        </aside>
        <article className="prose">
          {data.mode === "beginner" && (
            <section className="primer">
              <p className="eyebrow">Перед чтением</p>
              <RichText text={c.primer} />
            </section>
          )}
          <p className="scene">
            <RichText text={c.scene} />
          </p>
          {c.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>
                <RichText text={s.body} />
              </p>
            </section>
          ))}
          <Diagram key={c.id} chapter={c.id} />
          {q && (
            <section className="checkpoint">
              <p className="eyebrow">Проверка в пути</p>
              <Question
                item={q}
                value={data.answers[q.id]}
                choose={(v) => answer(q.id, v)}
              />
            </section>
          )}
          <div className="reading-end">
            <button className="primary" onClick={finish}>
              {c.id < 9
                ? "Прочитано · следующая глава"
                : "Прочитано · к викторине"}
              <Icon name="arrow" />
            </button>
            <button className="textbtn" onClick={atlas}>
              К карте путешествия
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}
