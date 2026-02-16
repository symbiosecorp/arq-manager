import jsPDF from "jspdf";

export interface ReciboData {
  numero?: string;
  recibiDe: string;
  cantidad: number;
  concepto: string;
  formaPago: string;
  fechaPago: string;
  totalLetras: string;
  observaciones?: string;
  receptor: string;
}

export function generarReciboPDF(data: ReciboData, download: boolean = true) {
  const doc = new jsPDF();

  // Configuración de colores
  const primaryColor: [number, number, number] = [41, 128, 185];
  const textColor: [number, number, number] = [33, 33, 33];
  const grayColor: [number, number, number] = [128, 128, 128];

  // Título
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("RECIBO DE PAGO", 105, 25, { align: "center" });

  // Línea decorativa
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);

  // Número de recibo (si existe)
  if (data.numero) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text(`No. ${data.numero}`, 190, 20, { align: "right" });
  }

  // Configurar fuente para el contenido
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);

  let y = 45;

  // Recibí de
  doc.setFont("helvetica", "bold");
  doc.text("Recibí de:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.recibiDe.toUpperCase(), 48, y);

  y += 15;

  // Cantidad recibida
  doc.setFont("helvetica", "bold");
  doc.text("Cantidad recibida:", 20, y);
  doc.setFont("helvetica", "normal");
  const cantidadFormateada = `$${data.cantidad.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  doc.text(cantidadFormateada, 65, y);

  y += 15;

  // Concepto de pago
  doc.setFont("helvetica", "bold");
  doc.text("Concepto de pago:", 20, y);
  doc.setFont("helvetica", "normal");

  // Manejar texto largo en concepto
  const conceptoLines = doc.splitTextToSize(data.concepto.toUpperCase(), 130);
  doc.text(conceptoLines, 20, y + 7);
  y += 7 + conceptoLines.length * 5;

  y += 8;

  // Forma de pago
  doc.setFont("helvetica", "bold");
  doc.text("Forma de pago:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.formaPago, 56, y);

  y += 15;

  // Fecha de pago
  doc.setFont("helvetica", "bold");
  doc.text("Fecha de pago:", 20, y);
  doc.setFont("helvetica", "normal");
  const fecha = new Date(data.fechaPago);
  const fechaFormateada = fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(fechaFormateada, 54, y);

  y += 15;

  // Total en letras (con fondo)
  doc.setFillColor(240, 240, 240);
  doc.rect(20, y - 5, 170, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Total en letras:", 22, y + 2);
  doc.setFont("helvetica", "normal");
  const letrasLines = doc.splitTextToSize(data.totalLetras.toUpperCase(), 100);
  doc.text(letrasLines, 22, y + 8);

  y += 8 + letrasLines.length * 5 + 5;

  // Observaciones (si existen)
  if (data.observaciones && data.observaciones.trim()) {
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 20, y);
    doc.setFont("helvetica", "normal");
    const observacionesLines = doc.splitTextToSize(
      data.observaciones.toUpperCase(),
      170,
    );
    doc.text(observacionesLines, 20, y + 7);
    y += 7 + observacionesLines.length * 5;
  }

  y += 25;

  // Nombre del receptor con línea de firma
  doc.setFont("helvetica", "bold");
  doc.text("Nombre del receptor:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.receptor.toUpperCase(), 20, y + 7);

  // Línea de firma
  y += 20;
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.3);
  doc.line(20, y, 100, y);
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text("Firma del receptor", 60, y + 5, { align: "center" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  const fechaGeneracion = new Date().toLocaleString("es-ES");
  doc.text(`Generado el ${fechaGeneracion}`, 105, 285, { align: "center" });

  // Descargar o abrir en nueva ventana
  if (download) {
    const nombreArchivo = `Recibo_${data.numero || Date.now()}.pdf`;
    doc.save(nombreArchivo);
  } else {
    // Abrir en nueva ventana
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  }

  return doc;
}
