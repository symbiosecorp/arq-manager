"use client";

import { useState } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Plus,
  Users,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Tipos
interface Usuario {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  diasDisponibles: number;
}

interface Vacacion {
  id: string;
  usuarioId: string;
  fechaInicio: string;
  fechaFin: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  motivo: string;
}

// Datos simulados fuera del componente para evitar re-creación
const usuarios: Usuario[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@empresa.com",
    department: "Dirección",
    avatar: "",
    diasDisponibles: 15,
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@empresa.com",
    department: "Arquitectura",
    avatar: "",
    diasDisponibles: 12,
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    department: "Obra",
    avatar: "",
    diasDisponibles: 10,
  },
  {
    id: "4",
    name: "Ana López",
    email: "ana.lopez@empresa.com",
    department: "Administración",
    avatar: "",
    diasDisponibles: 18,
  },
  {
    id: "5",
    name: "Roberto Silva",
    email: "roberto.silva@empresa.com",
    department: "Arquitectura",
    avatar: "",
    diasDisponibles: 8,
  },
];

const vacacionesIniciales: Vacacion[] = [
  {
    id: "v1",
    usuarioId: "1",
    fechaInicio: "2026-03-10",
    fechaFin: "2026-03-15",
    estado: "aprobada",
    motivo: "Vacaciones de primavera",
  },
  {
    id: "v2",
    usuarioId: "2",
    fechaInicio: "2026-02-25",
    fechaFin: "2026-02-28",
    estado: "pendiente",
    motivo: "Asuntos personales",
  },
  {
    id: "v3",
    usuarioId: "3",
    fechaInicio: "2026-04-01",
    fechaFin: "2026-04-10",
    estado: "aprobada",
    motivo: "Viaje familiar",
  },
  {
    id: "v4",
    usuarioId: "4",
    fechaInicio: "2026-02-20",
    fechaFin: "2026-02-22",
    estado: "rechazada",
    motivo: "Cita médica",
  },
  {
    id: "v5",
    usuarioId: "5",
    fechaInicio: "2026-03-01",
    fechaFin: "2026-03-05",
    estado: "pendiente",
    motivo: "Descanso",
  },
];

// Mapa de usuarios para O(1) lookup
const usuariosMap = new Map(usuarios.map((u) => [u.id, u]));

function getEstadoConfig(estado: Vacacion["estado"]) {
  const config = {
    pendiente: {
      label: "Pendiente",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      icon: AlertCircle,
    },
    aprobada: {
      label: "Aprobada",
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      icon: CheckCircle2,
    },
    rechazada: {
      label: "Rechazada",
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      icon: XCircle,
    },
  };
  return config[estado];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function VacacionesPage() {
  const [vacaciones, setVacaciones] = useState<Vacacion[]>(vacacionesIniciales);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedUsuario, setSelectedUsuario] = useState<string>("");
  const [openNewVacacion, setOpenNewVacacion] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Derivar vacaciones del día seleccionado sin useEffect
  const vacacionesDelDia = selectedDate
    ? vacaciones.filter((v) => {
        const inicio = parseISO(v.fechaInicio);
        const fin = parseISO(v.fechaFin);
        return isWithinInterval(selectedDate, { start: inicio, end: fin });
      })
    : [];

  // Estadísticas derivadas
  const stats = {
    totalVacaciones: vacaciones.length,
    pendientes: vacaciones.filter((v) => v.estado === "pendiente").length,
    aprobadas: vacaciones.filter((v) => v.estado === "aprobada").length,
    usuariosConVacaciones: new Set(vacaciones.map((v) => v.usuarioId)).size,
  };

  // Días con vacaciones para marcar en el calendario
  const diasConVacaciones = vacaciones.flatMap((v) => {
    const dias: Date[] = [];
    const inicio = parseISO(v.fechaInicio);
    const fin = parseISO(v.fechaFin);
    const current = new Date(inicio);
    while (current <= fin) {
      dias.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dias;
  });

  function handleAprobar(id: string) {
    setVacaciones((prev) =>
      prev.map((v) => (v.id === id ? { ...v, estado: "aprobada" as const } : v))
    );
  }

  function handleRechazar(id: string) {
    setVacaciones((prev) =>
      prev.map((v) => (v.id === id ? { ...v, estado: "rechazada" as const } : v))
    );
  }

  function handleCrearVacacion() {
    if (!selectedUsuario || !dateRange.from || !dateRange.to) return;

    const nuevaVacacion: Vacacion = {
      id: `v${Date.now()}`,
      usuarioId: selectedUsuario,
      fechaInicio: format(dateRange.from, "yyyy-MM-dd"),
      fechaFin: format(dateRange.to, "yyyy-MM-dd"),
      estado: "pendiente",
      motivo: "Nueva solicitud",
    };

    setVacaciones((prev) => [...prev, nuevaVacacion]);
    setOpenNewVacacion(false);
    setSelectedUsuario("");
    setDateRange({ from: undefined, to: undefined });
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vacaciones de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra y aprueba las solicitudes de vacaciones
          </p>
        </div>
        <Dialog open={openNewVacacion} onOpenChange={setOpenNewVacacion}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Solicitud
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Vacaciones</DialogTitle>
              <DialogDescription>
                Selecciona el usuario y el rango de fechas para la solicitud.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Select value={selectedUsuario} onValueChange={setSelectedUsuario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.name} - {usuario.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Rango de fechas</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd MMM", { locale: es })} -{" "}
                            {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                          </>
                        ) : (
                          format(dateRange.from, "dd MMM yyyy", { locale: es })
                        )
                      ) : (
                        "Selecciona las fechas"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) =>
                        setDateRange({ from: range?.from, to: range?.to })
                      }
                      numberOfMonths={2}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCrearVacacion}
                disabled={!selectedUsuario || !dateRange.from || !dateRange.to}
              >
                Crear Solicitud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVacaciones}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aprobadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usuariosConVacaciones}</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendario */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendario de Vacaciones</CardTitle>
            <CardDescription>
              Selecciona una fecha para ver las vacaciones programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              className="rounded-md border"
              modifiers={{
                vacation: diasConVacaciones,
              }}
              modifiersClassNames={{
                vacation: "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100",
              }}
            />
          </CardContent>
        </Card>

        {/* Vacaciones del día */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: es })
                : "Selecciona una fecha"}
            </CardTitle>
            <CardDescription>
              {vacacionesDelDia.length > 0
                ? `${vacacionesDelDia.length} vacacion(es) programada(s)`
                : "Sin vacaciones programadas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vacacionesDelDia.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No hay vacaciones para esta fecha
                </p>
              ) : (
                vacacionesDelDia.map((vacacion) => {
                  const usuario = usuariosMap.get(vacacion.usuarioId);
                  const estadoConfig = getEstadoConfig(vacacion.estado);
                  const EstadoIcon = estadoConfig.icon;

                  return (
                    <div
                      key={vacacion.id}
                      className="flex flex-col gap-3 rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={usuario?.avatar} />
                          <AvatarFallback>
                            {usuario ? getInitials(usuario.name) : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{usuario?.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {usuario?.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {format(parseISO(vacacion.fechaInicio), "dd MMM", {
                            locale: es,
                          })}{" "}
                          -{" "}
                          {format(parseISO(vacacion.fechaFin), "dd MMM yyyy", {
                            locale: es,
                          })}
                        </p>
                        <p className="mt-1">{vacacion.motivo}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={cn("gap-1", estadoConfig.color)}>
                          <EstadoIcon className="h-3 w-3" />
                          {estadoConfig.label}
                        </Badge>
                        {vacacion.estado === "pendiente" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRechazar(vacacion.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAprobar(vacacion.id)}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de todas las solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Solicitudes</CardTitle>
          <CardDescription>
            Lista completa de solicitudes de vacaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vacaciones.map((vacacion) => {
              const usuario = usuariosMap.get(vacacion.usuarioId);
              const estadoConfig = getEstadoConfig(vacacion.estado);
              const EstadoIcon = estadoConfig.icon;

              return (
                <div
                  key={vacacion.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={usuario?.avatar} />
                      <AvatarFallback>
                        {usuario ? getInitials(usuario.name) : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{usuario?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(vacacion.fechaInicio), "dd MMM", {
                          locale: es,
                        })}{" "}
                        -{" "}
                        {format(parseISO(vacacion.fechaFin), "dd MMM yyyy", {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={cn("gap-1", estadoConfig.color)}>
                      <EstadoIcon className="h-3 w-3" />
                      {estadoConfig.label}
                    </Badge>
                    {vacacion.estado === "pendiente" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRechazar(vacacion.id)}
                        >
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAprobar(vacacion.id)}
                        >
                          Aprobar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
