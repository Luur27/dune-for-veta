import { art, chapters, num, termById, terms } from "../data";
import { welcome } from "../data/guide";
import type { Progress } from "../data/progress";
import { Icon } from "./Icons";
import { RichText } from "./RichText";
export function Home({
  data,
  go,
  mode,
  quiz,
  open,
}: {
  data: Progress;
  go: (n: number) => void;
  mode: (m: Progress["mode"]) => void;
  quiz: () => void;
  open: (id: string) => void;
}) {
  return (
    <main id="main">
      <section className="hero">
        <picture>
          <source media="(max-width:650px)" srcSet={art("arrakis-phone")} />
          <img
            className="hero-art"
            alt="Гигантский червь поднимается над грядой дюн перед тремя путниками"
            src={art("arrakis")}
            fetchPriority="high"
          />
        </picture>
        <div className="grains" aria-hidden="true" />
        <div className="shell hero-content">
          <div className="hero-kicker">
            <i /> ПУТЕВОДИТЕЛЬ ДЛЯ ВЕТЫ
          </div>
          <h1>
            {welcome.heading[0]} <br />
            {welcome.heading[1]} <br />
            <em>{welcome.heading[2]}</em>
          </h1>
          <p>{welcome.invitation}</p>
          <button className="primary" onClick={() => go(data.last)}>
            {data.read.length || data.last !== 1
              ? "Продолжить путешествие"
              : "Начать путешествие"}
            <Icon name="arrow" />
          </button>
          <div className="modepick" aria-label="Режим чтения" role="group">
            {welcome.modes.map(([id, label]) => (
              <button
                aria-pressed={data.mode === id}
                key={id}
                onClick={() => mode(id)}
              >
                <i />
                {label}
              </button>
            ))}
          </div>
        </div>
        <span className="plate" aria-hidden="true">
          ARRAKIS <i /> ПЕСЧАНОЕ МОРЕ
        </span>
      </section>
      <div className="strip">
        <div className="shell strip-inner">
          <span>
            <Icon name="book" size={15} /> {chapters.length} глав
          </span>
          <span>
            <Icon name="layers" size={16} /> {terms.length} понятий
          </span>
          <span>
            <Icon name="flag" size={15} /> До финала второго фильма
          </span>
        </div>
      </div>
      <section id="atlas" className="atlas shell">
        <div className="section-title">
          <div>
            <p className="eyebrow">
              <i /> Маршрут путешествия
            </p>
            <h2>Атлас глав</h2>
          </div>
          <span className="count">
            {num(data.read.length)} / 09 <span>прочитано</span>
          </span>
        </div>
        <p className="intro">
          <RichText text={welcome.route} />
        </p>
        <div className="chapter-grid">
          {chapters.map((c) => (
            <button className="cover" key={c.id} onClick={() => go(c.id)}>
              <div className="cover-art">
                <img alt="" loading="lazy" src={art("chapter-" + c.id)} />
                <span>
                  {data.read.includes(c.id) ? (
                    <Icon name="check" size={15} />
                  ) : (
                    num(c.id)
                  )}
                </span>
              </div>
              <div className="cover-copy">
                <small>Глава {num(c.id)}</small>
                <h3>{c.title}</h3>
                <p>{c.deck}</p>
                <span className="cover-arrow">
                  <Icon name="arrow" size={17} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="character-strip shell">
        <div>
          <p className="eyebrow">Энциклопедия · персонажи</p>
          <h2>Лица Арракиса</h2>
        </div>
        <div className="faces">
          {welcome.faces.map((id) => (
            <button onClick={() => open(id)} key={id}>
              <img loading="lazy" src={art(id)} alt="" />
              <span>{termById.get(id)!.name} ↗</span>
            </button>
          ))}
        </div>
      </section>
      <section className="journal shell">
        <div>
          <p className="eyebrow">Дневник путешествия</p>
          <h2>Полевые заметки</h2>
        </div>
        {data.read.length ? (
          <div className="facts">
            {chapters
              .filter((c) => data.read.includes(c.id))
              .map((c) => (
                <details key={c.id}>
                  <summary>
                    Глава {num(c.id)} · {c.short}
                  </summary>
                  <p>
                    <RichText text={c.discovery} />
                  </p>
                </details>
              ))}
          </div>
        ) : (
          <p>
            Когда отметишь главу прочитанной, здесь появится открытый в ней
            факт.
          </p>
        )}
        <button className="secondary" onClick={quiz}>
          Итоговая викторина <Icon name="arrow" size={17} />
        </button>
      </section>
    </main>
  );
}
