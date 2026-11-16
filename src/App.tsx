import { useEffect, useState } from "react";
import { chapters, num, termById } from "./data";
import { readProgress, saveProgress } from "./data/progress";
import { Home } from "./components/Home";
import { Reader } from "./components/Reader";
import { Finale } from "./components/Finale";
import { Article, Search } from "./components/Library";
import { Overlay } from "./components/Overlay";
import { OpenTerm } from "./components/RichText";
import { Brand, Icon } from "./components/Icons";
type Panel = "search" | "menu" | "sources" | string;
const getRoute = () => window.location.hash.slice(1);
export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [data, setData] = useState(readProgress);
  const [panels, setPanels] = useState<Panel[]>([]);
  const panel = panels.at(-1);
  const c = chapters.find((ch) => route === "chapter-" + ch.id);
  const isQuiz = route === "quiz";
  useEffect(() => {
    const change = () => {
      setPanels([]);
      setRoute(getRoute());
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    saveProgress(data);
  }, [data]);
  useEffect(() => {
    if (c) setData((old) => (old.last === c.id ? old : { ...old, last: c.id }));
    document.title =
      (c ? c.short : isQuiz ? "Викторина" : "Путеводитель для Веты") +
      " · Дюна";
    const target = document.getElementById(
      route === "atlas" ? "atlas" : "main",
    );
    if (route === "atlas") target?.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
    if (route) {
      target?.setAttribute("tabindex", "-1");
      target?.focus({ preventScroll: true });
    }
  }, [route, c, isQuiz]);
  const close = () => setPanels([]);
  function nav(value: string) {
    close();
    if (route === value) {
      if (value === "atlas") document.getElementById("atlas")?.scrollIntoView();
      else window.scrollTo(0, 0);
    } else window.location.hash = value;
  }
  const go = (n: number) => nav("chapter-" + n);
  function open(id: string) {
    if (!termById.has(id)) return;
    setPanels((stack) => [...stack, id]);
    setData((old) =>
      old.seen.includes(id) ? old : { ...old, seen: [...old.seen, id] },
    );
  }
  function mark() {
    if (!c) return;
    setData((old) =>
      old.read.includes(c.id) ? old : { ...old, read: [...old.read, c.id] },
    );
    if (c.id === 9) nav("quiz");
    else go(c.id + 1);
  }
  const search = () => setPanels(["search"]);
  const back = () => setPanels((stack) => stack.slice(0, -1));
  const article = panel ? termById.get(panel) : undefined;
  return (
    <OpenTerm.Provider value={open}>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          const main = document.querySelector("main");
          if (main) {
            main.tabIndex = -1;
            main.focus();
          }
        }}
      >
        К содержанию
      </a>
      <header className="mast">
        <div className="shell mast-inner">
          <button
            className="logo"
            onClick={() => nav("")}
            aria-label="Дюна · на главную"
          >
            <Brand />
          </button>
          <span className="brand-note">Полевой атлас</span>
          <nav aria-label="Основная навигация">
            <button className="desk-nav" onClick={() => nav("atlas")}>
              <Icon name="map" size={17} />
              Атлас глав
            </button>
            <button className="nav-search" onClick={search}>
              <Icon name="book" size={17} />
              <span>Энциклопедия</span>
            </button>
            <button className="desk-nav" onClick={() => nav("quiz")}>
              Викторина
            </button>
          </nav>
          <span className="progress-badge" title="Прочитано глав">
            <i
              style={{
                background:
                  "conic-gradient(var(--gold) " +
                  (data.read.length / 9) * 360 +
                  "deg,#48483c 0)",
              }}
            />
            {num(data.read.length)} / 09
          </span>
          <button
            className="mobile-menu"
            onClick={() => setPanels(["menu"])}
            aria-label="Меню"
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      {c ? (
        <Reader
          key={c.id}
          c={c}
          data={data}
          go={go}
          atlas={() => nav("atlas")}
          finish={mark}
          answer={(id, v) =>
            setData((old) => ({ ...old, answers: { ...old.answers, [id]: v } }))
          }
        />
      ) : isQuiz ? (
        <Finale
          data={data}
          go={go}
          atlas={() => nav("atlas")}
          answer={(id, v) =>
            setData((old) => ({ ...old, final: { ...old.final, [id]: v } }))
          }
        />
      ) : (
        <Home
          data={data}
          go={go}
          mode={(mode) => setData((old) => ({ ...old, mode }))}
          quiz={() => nav("quiz")}
          open={open}
        />
      )}
      <footer className="shell">
        <Brand />
        <span>Путеводитель для Веты</span>
        <button onClick={() => setPanels(["sources"])}>Об источниках</button>
      </footer>
      {panel && (
        <Overlay
          close={close}
          label={
            article?.name ||
            (panel === "search"
              ? "Энциклопедия"
              : panel === "menu"
                ? "Меню"
                : "Об источниках")
          }
        >
          {panels.includes("search") && (
            <Search active={panel === "search"} open={open} />
          )}
          {article && (
            <Article
              term={article}
              open={open}
              back={panels.length > 1 ? back : undefined}
              backLabel={
                panels.at(-2) === "search"
                  ? "К результатам поиска"
                  : "К предыдущей статье"
              }
            />
          )}
          {panel === "menu" && (
            <>
              <p className="eyebrow">Навигация</p>
              <h2>Путеводитель</h2>
              <div className="menu-links">
                <button onClick={() => nav("atlas")}>Атлас глав</button>
                <button onClick={search}>Энциклопедия</button>
                <button onClick={() => nav("quiz")}>Итоговая викторина</button>
              </div>
            </>
          )}
          {panel === "sources" && (
            <>
              <p className="eyebrow">О путеводителе</p>
              <h2>Источники</h2>
              <p>
                Сюжет ограничен фильмами Дени Вильнёва «Дюна» (2021) и «Дюна:
                Часть вторая» (2024). Последовательность финала и решения
                персонажей сверены со сценарием второй части.
              </p>
              <p>
                <a href="https://d2bu9v0mnky9ur.cloudfront.net/academy2024/scripts/dune_part_two.pdf">
                  Сценарий Вильнёва и Джона Спэйтса ↗
                </a>
              </p>
              <p>
                Родословные, словарь и экология опираются на первый роман Фрэнка
                Герберта «Дюна» (1965), в том числе приложения I и IV и словарь
                терминов. Отличия фильмов оговорены в тексте.
              </p>
              <p>
                <a href="https://penguinrandomhousehighereducation.com/book/?isbn=9780441172719">
                  Издание оригинального романа ↗
                </a>
              </p>
              <p>
                Омниус в главе 8 взят из поздних приквелов Брайана Герберта и
                Кевина Дж. Андерсона.
              </p>
              <p>
                <a href="https://dunenovels.com/the-machine-crusade/">
                  Официальная страница приквела ↗
                </a>
              </p>
              <p className="source">
                Иллюстрации созданы специально для путеводителя. Неофициальный
                подарок поклоннице «Дюны».
              </p>
            </>
          )}
        </Overlay>
      )}
    </OpenTerm.Provider>
  );
}
