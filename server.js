const http = require('http');
const ExcelJS = require('exceljs');

const server = http.createServer(async (req, res) => {
  // Validación de ruta
  if (req.url !== '/reporte') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Visita /reporte para descargar el Excel'); // Mensaje pedido
  }

  try {
    // Configurar cabeceras para descarga de archivo .xlsx
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="reporte_ventas.xlsx"'
    });

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
    const worksheet = workbook.addWorksheet('Ventas'); // Hoja Ventas

    // Columnas
    worksheet.columns = [
      { header: 'Producto', key: 'producto', width: 20 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Precio', key: 'precio', width: 15 }
    ];

    // 20 filas de prueba
    for (let i = 1; i <= 20; i++) {
      worksheet.addRow({
        producto: `Producto ${i}`,
        cantidad: Math.floor(Math.random() * 50) + 1,
        precio: (Math.random() * 100 + 10).toFixed(2)
      }).commit();
    }

    await workbook.commit(); // Cerrar el stream de Excel
  } catch (error) {
    console.error('Error al generar Excel:', error); // Manejo de errores
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error interno al generar el reporte');
    }
  }
});

server.listen(3000, () => {
  console.log('Servidor listo en http://localhost:3000');
});