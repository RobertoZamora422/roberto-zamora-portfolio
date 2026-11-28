export type Revision = "borrador" | "aprobado";

interface ArchivoRevisado {
  revision: Revision;
  archivo: string;
}

export interface TextoConTitulo {
  titulo: string;
  descripcion: string;
}

interface PortadaProfesional {
  area: string;
  nombreCompleto?: string;
  titular: readonly [primera: string, segunda: string, enfasis: string];
  estudios: string;
  introduccion: string;
  enfoque: readonly string[];
  ubicacion: string;
  ejes: readonly string[];
  capacidades: readonly TextoConTitulo[];
  trayectoria: readonly string[];
  datos: readonly TextoConTitulo[];
}

export interface Perfil {
  revision: Revision;
  nombre: string;
  cvPdf?: ArchivoRevisado;
  retrato?: ArchivoRevisado & { alt: string };
  correo?: string;
  whatsapp?: { revision: Revision; numero: string };
  enlaces?: readonly { titulo: string; url: string }[];
  portada: PortadaProfesional;
}

interface PaginaProyecto {
  revision: Revision;
  entradilla: string;
  contexto: readonly string[];
  solucion: readonly string[];
  participacion: readonly string[];
  tecnologias?: readonly string[];
  evidencias: readonly string[];
  capturas?: readonly (ArchivoRevisado & {
    titulo: string;
    alt: string;
    descripcion: string;
    nota?: string;
    ancho: number;
    alto: number;
  })[];
}

interface Proyecto {
  slug: string;
  revision: Revision;
  nombre: string;
  categoria: string;
  estado: string;
  descripcion: string;
  repositorio: string;
  aplicacion?: string;
  visual: "conceptual" | { captura: string };
  pagina?: PaginaProyecto;
}

export interface Apartado {
  titulo: string;
  parrafos: readonly string[];
}

interface Caso {
  revision: Revision;
  proyecto: string;
  titulo: string;
  resumen: string;
  pregunta: string;
  introduccion: string;
  resumenVisual: readonly TextoConTitulo[];
  competencias?: string;
  periodo?: string;
  contexto: readonly string[];
  alcance: readonly string[];
  decisiones: readonly Apartado[];
  ejemplo?: {
    situaciones: readonly Apartado[];
    conclusion: string;
    referencias: readonly { evidencia: string; texto: string; ancla: string }[];
  };
  trazabilidad: readonly string[];
  validacion: {
    introduccion: string;
    escenarios: readonly TextoConTitulo[];
    ejecucion: string;
    resultados: readonly TextoConTitulo[];
    fuente: string;
    limites: readonly string[];
  };
  evidencias: readonly string[];
  aprendizajes?: readonly string[];
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
}
