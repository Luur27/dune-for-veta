import { type Question as Item } from "../data";
import { Icon } from "./Icons";
export function Question({
  item,
  value,
  choose,
}: {
  item: Item;
  value?: number;
  choose: (n: number) => void;
}) {
  return (
    <fieldset className="question">
      <legend>{item.question}</legend>
      <div className="options">
        {item.options.map((option, i) => (
          <button
            key={option}
            className={value === i ? "selected" : ""}
            aria-pressed={value === i}
            onClick={() => choose(i)}
          >
            <span>{["А", "Б", "В"][i]}</span>
            {option}
            {value === i && <Icon name="check" size={16} />}
          </button>
        ))}
      </div>
      {value !== undefined && (
        <p className="feedback" role="status">
          <strong>{value === item.correct ? "Верно. " : "Разберёмся. "}</strong>
          {item.explanation}
        </p>
      )}
    </fieldset>
  );
}
