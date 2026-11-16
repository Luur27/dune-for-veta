import { useState } from "react";
import { art, chapters, finalQuestions } from "../data";
import { ending } from "../data/guide";
import type { Progress } from "../data/progress";
import { Icon } from "./Icons";
import { Question } from "./Question";

async function makeCard(score: number, seen: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;
  const img = new Image();
  img.src = art("arrakis");
  await img.decode();
  ctx.fillStyle = "#141611";
  ctx.fillRect(0, 0, 1080, 720);
  ctx.drawImage(img, 0, 0, 1080, 435);
  const wash = ctx.createLinearGradient(0, 210, 0, 475);
  wash.addColorStop(0, "transparent");
  wash.addColorStop(1, "#141611");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 210, 1080, 265);
  ctx.strokeStyle = "#c39a64";
  ctx.strokeRect(24, 24, 1032, 672);
  ctx.fillStyle = "#efba7c";
  ctx.font = "22px monospace";
  ctx.fillText("D U N E   /   ПОЛЕВОЙ АТЛАС", 64, 443);
  ctx.fillStyle = "#fff0d5";
  ctx.font = "58px Georgia";
  ctx.fillText("Вета · Знаток Арракиса", 60, 532);
  ctx.font = "27px Arial";
  ctx.fillText(
    "9 глав пройдено   /   Викторина " + score + " из " + finalQuestions.length,
    64,
    608,
  );
  ctx.fillText("Изучено понятий: " + seen, 64, 650);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("PNG"))),
      "image/png",
    ),
  );
}
export function Finale({
  data,
  answer,
  go,
  atlas,
}: {
  data: Progress;
  answer: (id: string, v: number) => void;
  go: (n: number) => void;
  atlas: () => void;
}) {
  const [index, setIndex] = useState(() => {
    const next = finalQuestions.findIndex(
      (q) => data.final[q.id] === undefined,
    );
    return next < 0 ? finalQuestions.length : next;
  });
  const [notice, setNotice] = useState("");
  const allAnswered = finalQuestions.every(
    (q) => data.final[q.id] !== undefined,
  );
  const score = finalQuestions.filter(
    (q) => q.correct === data.final[q.id],
  ).length;
  const missing = chapters.filter((c) => !data.read.includes(c.id));
  const q = finalQuestions[index];
  async function share() {
    try {
      const blob = await makeCard(score, data.seen.length);
      const file = new File([blob], "Вета — Знаток Арракиса.png", {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Знаток Арракиса" });
        return;
      }
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setNotice(
        "Карточка сохранена в PNG. Её можно отправить как обычную картинку.",
      );
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError"))
        setNotice("Не удалось сохранить карточку. Попробуй ещё раз.");
    }
  }
  return (
    <main className="finale shell" id="main">
      <button className="textbtn" onClick={atlas}>
        <Icon name="back" size={16} />К атласу
      </button>
      {q ? (
        <section>
          <p className="eyebrow">
            Итоговая викторина · {index + 1} / {finalQuestions.length}
          </p>
          <h1>Проверка в пустыне</h1>
          <progress max={finalQuestions.length} value={index} />
          <Question
            key={q.id}
            item={q}
            value={data.final[q.id]}
            choose={(v) => answer(q.id, v)}
          />
          <div className="actions">
            <button
              className="secondary"
              disabled={!index}
              onClick={() => setIndex(index - 1)}
            >
              Назад
            </button>
            <button
              className="primary"
              disabled={data.final[q.id] === undefined}
              onClick={() => setIndex(index + 1)}
            >
              {index + 1 === finalQuestions.length
                ? "Посмотреть результат"
                : "Дальше"}
              <Icon name="arrow" />
            </button>
          </div>
        </section>
      ) : (
        allAnswered && (
          <section>
            {missing.length === 0 ? (
              <>
                <div className="certificate">
                  <img src={art("arrakis")} alt="" />
                  <div>
                    <p className="eyebrow">Личная карточка · Вета</p>
                    <h2>Знаток Арракиса</h2>
                    <span>
                      9 глав · {score} / {finalQuestions.length} в викторине ·
                      Изучено понятий: {data.seen.length}
                    </span>
                  </div>
                </div>
                <h1>{ending.title}</h1>
                <p>{ending.summary}</p>
                <button className="primary" onClick={share}>
                  <Icon name="share" />
                  Поделиться карточкой
                </button>
                <p role="status">{notice}</p>
              </>
            ) : (
              <>
                <p className="eyebrow">Викторина завершена</p>
                <h1>
                  Результат: {score} из {finalQuestions.length}
                </h1>
                <p>
                  Для карточки «Знаток Арракиса» осталось прочитать глав:{" "}
                  {missing.length}.
                </p>
                <button className="primary" onClick={() => go(missing[0].id)}>
                  К непрочитанной главе <Icon name="arrow" />
                </button>
              </>
            )}
            <button className="textbtn" onClick={() => setIndex(0)}>
              Пересмотреть ответы
            </button>
          </section>
        )
      )}
    </main>
  );
}
