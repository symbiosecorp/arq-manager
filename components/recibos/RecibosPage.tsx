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
  Receipt,
  Calendar,
  DollarSign,
  Plus,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import { NewRecibo } from "@/components/recibos/NewRecibo";
import { generarReciboPDF } from "@/lib/pdf-generator";

// Datos mock de recibos
const mockRecibos = [
  {
    id: 1,
    numero: "REC-2026-001",
    recibiDe: "ANDREA PLIEGO",
    cantidad: 12600.0,
    concepto: "CÁLCULO ESTRUCTURAL",
    formaPago: "Efectivo",
    fechaPago: "2026-02-09",
    totalLetras: "Doce mil Seiscientos pesos 00/100 M.N.",
    observaciones: "EFE EN OFICINA ENVIADO POR SU ASISTENTE",
    receptor: "MIGUEL GUTIERREZ",
  },
  {
    id: 2,
    numero: "REC-2026-002",
    recibiDe: "CONSTRUCTORA ABC S.A.",
    cantidad: 45000.0,
    concepto: "PAGO ANTICIPO PROYECTO RESIDENCIAL",
    formaPago: "Transferencia",
    fechaPago: "2026-02-10",
    totalLetras: "Cuarenta y cinco mil pesos 00/100 M.N.",
    observaciones: "TRANSFERENCIA BANCARIA BANAMEX",
    receptor: "PATRICIA MORALES",
  },
  {
    id: 3,
    numero: "REC-2026-003",
    recibiDe: "MARÍA GONZÁLEZ",
    cantidad: 8500.0,
    concepto: "PLANOS ARQUITECTÓNICOS",
    formaPago: "Efectivo",
    fechaPago: "2026-02-11",
    totalLetras: "Ocho mil Quinientos pesos 00/100 M.N.",
    observaciones: "",
    receptor: "CARLOS MENDOZA",
  },
  {
    id: 4,
    numero: "REC-2026-004",
    recibiDe: "INVERSIONES XYZ",
    cantidad: 125000.0,
    concepto: "PRIMERA PARCIALIDAD DISEÑO ESTRUCTURAL",
    formaPago: "Cheque",
    fechaPago: "2026-02-12",
    totalLetras: "Ciento veinticinco mil pesos 00/100 M.N.",
    observaciones: "CHEQUE NUM. 12345 BANCO SANTANDER",
    receptor: "JORGE HERNÁNDEZ",
  },
  {
    id: 5,
    numero: "REC-2026-005",
    recibiDe: "ROBERTO SILVA",
    cantidad: 15800.0,
    concepto: "SUPERVISIÓN DE OBRA ENERO 2026",
    formaPago: "Transferencia",
    fechaPago: "2026-02-13",
    totalLetras: "Quince mil Ochocientos pesos 00/100 M.N.",
    observaciones: "SPEI BBVA",
    receptor: "MIGUEL ÁNGEL CASTRO",
  },
];

function getFormaPagoColor(formaPago: string) {
  switch (formaPago) {
    case "Efectivo":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "Transferencia":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "Cheque":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    case "Tarjeta":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function RecibosPage() {
  const [openNewRecibo, setOpenNewRecibo] = useState(false);

  const totalRecibos = mockRecibos.reduce((acc, r) => acc + r.cantidad, 0);
  const recibosMesActual = mockRecibos.filter((r) => {
    const fecha = new Date(r.fechaPago);
    const hoy = new Date();
    return (
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  }).length;

  const handleVerRecibo = (recibo: (typeof mockRecibos)[0]) => {
    generarReciboPDF(
      {
        numero: recibo.numero,
        recibiDe: recibo.recibiDe,
        cantidad: recibo.cantidad,
        concepto: recibo.concepto,
        formaPago: recibo.formaPago,
        fechaPago: recibo.fechaPago,
        totalLetras: recibo.totalLetras,
        observaciones: recibo.observaciones,
        receptor: recibo.receptor,
      },
      false, // No descargar, solo ver
    );
  };

  const handleDescargarRecibo = (recibo: (typeof mockRecibos)[0]) => {
    generarReciboPDF(
      {
        numero: recibo.numero,
        recibiDe: recibo.recibiDe,
        cantidad: recibo.cantidad,
        concepto: recibo.concepto,
        formaPago: recibo.formaPago,
        fechaPago: recibo.fechaPago,
        totalLetras: recibo.totalLetras,
        observaciones: recibo.observaciones,
        receptor: recibo.receptor,
      },
      true, // Descargar
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recibos de Pago</h1>
          <p className="text-muted-foreground">
            Gestión y generación de recibos de pago
          </p>
        </div>
        <Dialog open={openNewRecibo} onOpenChange={setOpenNewRecibo}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Recibo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Recibo</DialogTitle>
              <DialogDescription>
                Completa la información para generar un recibo de pago en PDF.
              </DialogDescription>
            </DialogHeader>
            <NewRecibo />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recibos</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRecibos.length}</div>
            <p className="text-xs text-muted-foreground">
              Este mes: {recibosMesActual}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Recibido
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRecibos.toLocaleString("es-MX")}
            </div>
            <p className="text-xs text-muted-foreground">Todos los recibos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efectivo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {mockRecibos
                .filter((r) => r.formaPago === "Efectivo")
                .reduce((acc, r) => acc + r.cantidad, 0)
                .toLocaleString("es-MX")}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockRecibos.filter((r) => r.formaPago === "Efectivo").length}{" "}
              recibos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transferencias
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {mockRecibos
                .filter((r) => r.formaPago === "Transferencia")
                .reduce((acc, r) => acc + r.cantidad, 0)
                .toLocaleString("es-MX")}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                mockRecibos.filter((r) => r.formaPago === "Transferencia")
                  .length
              }{" "}
              recibos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recibos List */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {mockRecibos.map((recibo) => (
          <Card
            key={recibo.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{recibo.numero}</CardTitle>
                  <CardDescription>{recibo.recibiDe}</CardDescription>
                </div>
                <Badge className={getFormaPagoColor(recibo.formaPago)}>
                  {recibo.formaPago}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cantidad:</span>
                <span className="text-lg font-bold">
                  ${recibo.cantidad.toLocaleString("es-MX")}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Concepto:</div>
                <div className="text-sm font-medium">{recibo.concepto}</div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(recibo.fechaPago).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Receptor:</div>
                <div className="text-sm font-medium">{recibo.receptor}</div>
              </div>

              {recibo.observaciones && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Observaciones:
                  </div>
                  <div className="text-xs italic">{recibo.observaciones}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleVerRecibo(recibo)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDescargarRecibo(recibo)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
