export type Revision = "borrador" | "aprobado";

export interface Perfil {
  revision: Revision;
  nombre: string;
  presentacion: string;
  propuesta: string;
  oportunidades: string;
  formacion: readonly { programa: string; institucion: string; periodo: string }[];
  trayectoria: readonly { descripcion: string; evidencias: readonly string[] }[];
  retrato?: { revision: Revision; archivo: string; alt: string };
  intereses?: readonly { titulo: string; descripcion: string }[];
  correo?: string;
  enlaces?: readonly { titulo: string; url: string }[];
  casos?: readonly string[];
}

interface FichaProyecto {
  revision: Revision;
  nombre: string;
  resumen: string;
  estado: string;
}

export interface PaginaProyecto {
  revision: Revision;
  entradilla: string;
  destacado: string;
  problema: string;
  contexto: string;
  proposito: string;
  solucion: string;
  participacion: string;
  tecnologias?: readonly string[];
  evidencias: readonly string[];
}

export interface Proyecto {
  slug: string;
  ficha: FichaProyecto;
  pagina?: PaginaProyecto;
}

export interface Caso {
  revision: Revision;
  slug: string;
  proyecto: string;
  titulo: string;
  resumen: string;
  contexto: string;
  alcance: string;
  decisiones: string;
  trabajo: string;
  validacion: string;
  resultadosYLimites: string;
  evidencias: readonly string[];
  periodo?: string;
  competencia?: string;
  aprendizajes?: string;
}

export interface Evidencia {
  revision: Revision;
  id: string;
  titulo: string;
  tipo: string;
  fuente: string;
  autoria: string;
  afirmacion: string;
  recurso: { archivo: string } | { url: string };
}

export interface Registro {
  perfil?: Perfil;
  proyectos: readonly Proyecto[];
  casos: readonly Caso[];
  evidencias: readonly Evidencia[];
  casoDestacado?: string;
}
