export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const shapes: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </>
    ),
    back: <path d="M20 12H5m6-6-6 6 6 6" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    book: (
      <>
        <path d="M3 5q5-2 9 1 4-3 9-1v14q-5-2-9 1-4-3-9-1zM12 6v14" />
      </>
    ),
    map: (
      <>
        <path d="m2 6 6-2 8 2 6-2v15l-6 2-8-2-6 2zM8 4v15M16 6v15" />
      </>
    ),
    close: <path d="m5 5 14 14M19 5 5 19" />,
    check: <path d="m4 12 5 5L20 6" />,
    star: (
      <>
        <path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
      </>
    ),
    menu: <path d="M3 7h18M3 12h18M3 17h18" />,
    down: <path d="m6 9 6 6 6-6" />,
    layers: (
      <>
        <path d="m2 9 10-6 10 6-10 6zM3 14l9 5 9-5" />
      </>
    ),
    flag: (
      <>
        <path d="M5 21V3q4-2 8 0t7 0v10q-4 2-8 0t-7 0" />
      </>
    ),
    share: (
      <>
        <path d="M12 16V2m-5 5 5-5 5 5M4 13v8h16v-8" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}
export function Brand() {
  return (
    <span className="brand">
      <svg aria-hidden="true" viewBox="0 0 48 48" width="35" height="35">
        <g fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="24" cy="24" r="20" />
          <path d="m5 31 19-23 19 23M9 34l15-17 15 17M15 36l9-10 9 10" />
        </g>
      </svg>
      <span>DUNE</span>
    </span>
  );
}
