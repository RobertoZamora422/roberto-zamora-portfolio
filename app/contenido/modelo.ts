export type Revision = "borrador" | "aprobado";

interface ArchivoRevisado {
  revision: Revision;
  archivo: string;
}

interface TextoConTitulo {
  titulo: string;
  descripcion: string;
}

export interface PortadaProfesional {
  area: string;
  nombreCompleto?: string;
  titular: readonly [primera: string, segunda: string, enfasis: string];
  estudios: string;
  introduccion: string;
  enfoque: string;
  ubicacion: string;
  ejes: readonly string[];
  capacidades: readonly TextoConTitulo[];
  trayectoria: readonly string[];
  datos: readonly TextoConTitulo[];
}

export interface Perfil {
  revision: Revision;
  nombre: string;
  presentacion: string;
  propuesta: string;
  oportunidades: string;
  descripcionInicio?: string;
  sobreMi?: readonly string[];
  formacion: readonly { programa: string; institucion?: string; estado?: string; periodo?: string }[];
  trayectoria: readonly { titulo?: string; descripcion: string; evidencias: readonly string[] }[];
  cvPdf?: ArchivoRevisado;
  retrato?: ArchivoRevisado & { alt: string };
  intereses?: readonly { titulo: string; descripcion: string }[];
  correo?: string;
  whatsapp?: { revision: Revision; numero: string };
  enlaces?: readonly { titulo: string; url: string }[];
  casos?: readonly string[];
  portada?: PortadaProfesional;
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
  capturas?: readonly (ArchivoRevisado & {
    titulo: string;
    alt: string;
    descripcion: string;
    ancho: number;
    alto: number;
  })[];
}

export interface Proyecto {
  slug: string;
  ficha: FichaProyecto;
  pagina?: PaginaProyecto;
  portada?: {
    categoria: string;
    descripcion: string;
    repositorio: string;
    visual: "conceptual" | { captura: string };
  };
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
  resumenVisual?: readonly { etiqueta: string; valor: string; detalle?: string }[];
  ejemplo?: {
    titulo: string;
    situaciones: readonly { titulo: string; descripcion: string }[];
    referencias: readonly { evidencia: string; texto: string; ancla: string }[];
  };
  fichasBreves?: boolean;
  portada?: {
    indicadores: readonly { valor: string; descripcion: string }[];
    alcance: string;
  };
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
