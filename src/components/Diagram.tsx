import { useState } from "react";
import { diagramByChapter } from "../data";
import { RichText } from "./RichText";
import { Icon } from "./Icons";

type Layout = { dots: [number, number][]; edges: [number, number, boolean?][] };
const layouts: Record<string, Layout> = {
  houses: {
    dots: [
      [17, 65],
      [50, 20],
      [83, 65],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 2, true],
    ],
  },
  family: {
    dots: [
      [49, 11],
      [34, 40],
      [12, 40],
      [22, 83],
      [84, 40],
      [57, 83],
    ],
    edges: [
      [0, 1],
      [0, 4],
      [1, 3],
      [2, 3],
      [1, 5, true],
      [2, 5, true],
      [5, 4, true],
    ],
  },
  paths: {
    dots: [
      [50, 18],
      [23, 75],
      [77, 75],
    ],
    edges: [
      [0, 1],
      [0, 2],
    ],
  },
  ecology: {
    dots: [
      [20, 12],
      [20, 49],
      [20, 85],
      [76, 12],
      [76, 49],
      [76, 85],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [4, 5],
    ],
  },
};
export function Diagram({ chapter }: { chapter: number }) {
  const graph = diagramByChapter[chapter];
  const [index, setIndex] = useState(0);
  if (!graph) return null;
  const selected = graph.nodes[index];
  const layout = layouts[graph.mode];
  return (
    <section className="diagram">
      <div className="eyebrow">
        <Icon name="layers" size={17} /> Интерактивная схема
      </div>
      <h3>{graph.title}</h3>
      <p>{graph.hint}</p>
      {layout ? (
        <div className={"plot " + graph.mode}>
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {layout.edges.map(([a, b, dashed]) => {
              const [x1, y1] = layout.dots[a],
                [x2, y2] = layout.dots[b];
              return (
                <line
                  key={a + "-" + b}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray={dashed ? "4 5" : undefined}
                />
              );
            })}
          </svg>
          {graph.nodes.map((node, i) => (
            <button
              className="graph-node"
              aria-pressed={index === i}
              key={node[0]}
              style={{
                left: layout.dots[i][0] + "%",
                top: layout.dots[i][1] + "%",
              }}
              onClick={() => setIndex(i)}
            >
              {node[1]}
            </button>
          ))}
        </div>
      ) : (
        <div className="timeline">
          {graph.nodes.map((node, i) => (
            <button
              key={node[0]}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <span>{node[1]}</span>
              {node[2]}
            </button>
          ))}
        </div>
      )}
      <div className="diagram-detail" aria-live="polite">
        <b>
          {selected[1]} · {selected[2]}
        </b>
        <p>
          <RichText text={selected[3]} />
        </p>
      </div>
    </section>
  );
}
