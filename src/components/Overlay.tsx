import { useEffect, useRef } from "react";
import { Icon } from "./Icons";
export function Overlay({
  children,
  close,
  label,
}: {
  children: React.ReactNode;
  close: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const d = ref.current!;
    d.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      d.close();
      document.body.style.overflow = previous;
      trigger?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="overlay"
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="modal-inner">
        <button
          className="xbtn"
          aria-label="Закрыть и вернуться к чтению"
          onClick={close}
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
