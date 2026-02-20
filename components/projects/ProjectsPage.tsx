"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  Calendar,
  MapPin,
  Plus,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import { NewProject } from "@/components/projects/NewProject";

interface ProjectsPageProps {
  area: "auxadmin" | "obra" | "arquitectura";
}

const areaConfig = {
  auxadmin: {
    title: "Proyectos - Auxiliar Administrativo",
    description: "Gestión administrativa de proyectos",
    color: "blue",
  },
  obra: {
    title: "Proyectos - Obra",
    description: "Seguimiento de obras en construcción",
    color: "orange",
  },
  arquitectura: {
    title: "Proyectos - Arquitectura",
    description: "Diseños y planos arquitectónicos",
    color: "purple",
  },
};

const mockProjects = [
  {
    id: 1,
    name: "Torre Residencial Vista",
    client: "Grupo Inmobiliario Norte",
    location: "Col. Del Valle, CDMX",
    status: "En progreso",
    progress: 65,
    startDate: "2025-06-15",
    endDate: "2026-08-30",
    team: 12,
  },
  {
    id: 2,
    name: "Centro Comercial Plaza Sur",
    client: "Desarrollos Comerciales SA",
    location: "Coyoacán, CDMX",
    status: "En progreso",
    progress: 40,
    startDate: "2025-09-01",
    endDate: "2027-03-15",
    team: 18,
  },
  {
    id: 3,
    name: "Oficinas Corporativas Reforma",
    client: "Tech Solutions MX",
    location: "Paseo de la Reforma, CDMX",
    status: "Planificación",
    progress: 15,
    startDate: "2026-01-10",
    endDate: "2027-06-20",
    team: 8,
  },
  {
    id: 4,
    name: "Residencial Los Pinos",
    client: "Constructora Habitat",
    location: "Polanco, CDMX",
    status: "Completado",
    progress: 100,
    startDate: "2024-03-01",
    endDate: "2025-12-15",
    team: 15,
  },
  {
    id: 5,
    name: "Hospital Regional Norte",
    client: "Secretaría de Salud",
    location: "Tlalnepantla, Edo. Mex.",
    status: "En progreso",
    progress: 78,
    startDate: "2024-08-20",
    endDate: "2026-05-10",
    team: 25,
  },
  {
    id: 6,
    name: "Escuela Primaria Benito Juárez",
    client: "SEP",
    location: "Iztapalapa, CDMX",
    status: "En revisión",
    progress: 90,
    startDate: "2025-02-01",
    endDate: "2026-01-30",
    team: 10,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Completado":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "En progreso":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "Planificación":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "En revisión":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

function getProgressColor(progress: number) {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-yellow-500";
  return "bg-red-500";
}

export function ProjectsPage({ area }: ProjectsPageProps) {
  const config = areaConfig[area];
  const [openNewProject, setOpenNewProject] = useState(false);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <Dialog open={openNewProject} onOpenChange={setOpenNewProject}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
              <DialogDescription>
                Completa la información para registrar un nuevo proyecto en el
                sistema.
              </DialogDescription>
            </DialogHeader>
            <NewProject />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proyectos
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.filter((p) => p.status === "En progreso").length}
            </div>
            <p className="text-xs text-muted-foreground">Activos actualmente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.filter((p) => p.status === "Completado").length}
            </div>
            <p className="text-xs text-muted-foreground">Este año</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Personal Asignado
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.reduce((acc, p) => acc + p.team, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              En todos los proyectos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>{project.client}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {project.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(project.startDate).toLocaleDateString("es-ES", {
                  month: "short",
                  year: "numeric",
                })}{" "}
                -{" "}
                {new Date(project.endDate).toLocaleDateString("es-ES", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {project.team} personas
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
