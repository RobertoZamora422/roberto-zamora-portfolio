import { useEffect, useRef, useState, type MouseEvent } from "react";

type Seccion = { id: string; titulo: string };

export function IndiceCaso({ secciones }: { secciones: readonly Seccion[] }) {
  const [activa, fijarActiva] = useState<string>();
  const movil = useRef<HTMLDetailsElement>(null);
  const seguirAncla = useRef<() => void>(null);

  useEffect(() => {
    const destinos = secciones.flatMap(({ id }) => document.getElementById(id) ?? []).reverse();
    let frame = 0;
    let saltoPendiente = false;
    let posicionSalto: number | undefined;

    function actualizar() {
      frame = 0;
      const posicion = window.scrollY;
      const salto = saltoPendiente;
      saltoPendiente = false;
      const destino = destinos.find(({ id }) => `#${id}` === window.location.hash);
      // El navegador puede completar el salto después de hidratar o de cargar las fuentes.
      if (destino && (salto || Math.abs(destino.getBoundingClientRect().top
        - (parseFloat(getComputedStyle(destino).scrollMarginTop) || 0)) < 2)) {
        posicionSalto = posicion;
        fijarActiva(destino.id);
        return;
      }
      if (salto) posicionSalto = undefined;
      // El final de la página puede impedir que un destino llegue al inicio de la ventana.
      if (posicionSalto !== undefined && Math.abs(posicion - posicionSalto) < 2) return;
      posicionSalto = undefined;
      const alFinal = posicion > 0 && posicion + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const umbral = Math.min(window.innerHeight / 4, 180);
      const visible = alFinal ? destinos[0] : destinos.find((destino) => destino.getBoundingClientRect().top <= umbral);
      fijarActiva(visible?.id ?? secciones[0].id);
    }

    function programar() {
      if (!frame) frame = requestAnimationFrame(actualizar);
    }

    function marcarSalto() {
      saltoPendiente = true;
      programar();
    }

    seguirAncla.current = marcarSalto;
    window.addEventListener("scroll", programar, { passive: true });
    window.addEventListener("resize", programar);
    window.addEventListener("hashchange", marcarSalto);
    marcarSalto();
    return () => {
      seguirAncla.current = null;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", programar);
      window.removeEventListener("resize", programar);
      window.removeEventListener("hashchange", marcarSalto);
    };
  }, [secciones]);

  function elegir(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (movil.current) movil.current.open = false;
    seguirAncla.current?.();
  }

  const ubicacion = secciones.find(({ id }) => id === activa)?.titulo;
  const enlaces = (
    <ul role="list">
      {secciones.map(({ id, titulo }) => (
        <li key={id}>
          <a href={`#${id}`} aria-current={id === activa ? "location" : undefined} onClick={elegir}>
            {titulo}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="case-index" aria-label="Secciones del caso">
      <div className="case-index__desktop">
        <p className="technical-label">En este caso</p>
        {enlaces}
      </div>
      <details className="case-index__mobile" ref={movil}>
        <summary>
          En este caso {ubicacion && <span className="case-index__location">· {ubicacion}</span>}
        </summary>
        {enlaces}
      </details>
    </nav>
  );
}
