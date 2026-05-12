import { apiNotificacionService } from './apiNotificacionService';

export class NotificacionService {

    // Obtener correos activos desde la tabla existente
    static async obtenerCorreosActivos() {
        try {
            const correosActivos = await apiNotificacionService.configuracion.getTodosCorreosActivos();
            return correosActivos;
        } catch (error) {
            console.error('Error al obtener correos activos:', error);
            return [];
        }
    }

    // Generar HTML completo datos reales
    static generarHTMLCorreo(cuadroData, miembros, turnos, historialCuadro, historialTurnos, procesos, tipoOperacion, detallesOperacion) {
        const fechaActual = new Date().toLocaleString('es-CO');

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
                .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .section { margin-bottom: 30px; }
                .section-title { background: #f8fafc; padding: 10px; margin-bottom: 15px; border-left: 4px solid #2563eb; font-weight: bold; }
                .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-bottom: 20px; }
                .info-card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; }
                .info-label { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
                .info-value { font-weight: 500; color: #1f2937; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th { background: #1f2937; color: white; padding: 8px; text-align: left; font-size: 12px; }
                td { padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
                tr:hover { background: #f9fafb; }
                .status-active { background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 12px; }
                .status-inactive { background: #fed7d7; color: #c53030; padding: 2px 6px; border-radius: 12px; }
                .alert { padding: 15px; border-radius: 6px; margin-bottom: 20px; }
                .alert-info { background: #dbeafe; border: 1px solid #3b82f6; color: #1e40af; }
                .footer { background: #f8fafc; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header -->
                <div class="header">
                    <h1>🏥 Notificación Automática de Cambio en Sistema de Turnos</h1>
                    <p>Sistema de Gestión Hospitalaria - ${fechaActual}</p>
                </div>

                <div class="content">
                    <!-- Alerta de Operación -->
                    <div class="alert alert-info">
                        <strong>Tipo de Operación:</strong> ${tipoOperacion}<br>
                        <strong>Detalles:</strong> ${detallesOperacion}
                    </div>

                    <!-- Información del Cuadro -->
                    <div class="section">
                        <div class="section-title">📋 Información del Cuadro</div>
                        <div class="info-grid">
                            <div class="info-card">
                                <div class="info-label">Nombre del Cuadro</div>
                                <div class="info-value">${cuadroData?.nombre || 'No disponible'}</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Versión</div>
                                <div class="info-value">${cuadroData?.version || 'No disponible'}</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Categoría</div>
                                <div class="info-value">${cuadroData?.categoria || 'No disponible'}</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Período</div>
                                <div class="info-value">Mes: ${cuadroData?.mes || 'N/A'} - Año: ${cuadroData?.anio || 'N/A'}</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Estado</div>
                                <div class="info-value">
                                    <span class="${cuadroData?.estadoCuadro === 'abierto' ? 'status-active' : 'status-inactive'}">
                                        ${cuadroData?.estadoCuadro || 'No especificado'}
                                    </span>
                                </div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">Turno Excepción</div>
                                <div class="info-value">
                                    <span class="${cuadroData?.turnoExcepcion ? 'status-active' : 'status-inactive'}">
                                        ${cuadroData?.turnoExcepcion ? 'Sí' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${cuadroData?.categoria === 'multiproceso' && procesos?.length > 0 ? `
                    <!-- Procesos de Atención -->
                    <div class="section">
                        <div class="section-title">🔄 Procesos de Atención (${procesos.length} procesos)</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre del Proceso</th>
                                    <th>Detalle</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${procesos.map(proceso => `
                                <tr>
                                    <td>${proceso.nombre || 'Sin nombre'}</td>
                                    <td>${proceso.detalle || 'Sin detalle'}</td>
                                    <td>
                                        <span class="${proceso.estado ? 'status-active' : 'status-inactive'}">
                                            ${proceso.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : cuadroData?.categoria !== 'multiproceso' ? `
                    <!-- Procesos Individuales -->
                    <div class="section">
                        <div class="section-title">🔄 Información de Proceso</div>
                        <div class="info-grid">
                            ${cuadroData?.nombreMacroproceso ? `<div class="info-card">
                                <div class="info-label">Macroproceso</div>
                                <div class="info-value">${cuadroData.nombreMacroproceso}</div>
                            </div>` : ''}
                            ${cuadroData?.nombreProceso ? `<div class="info-card">
                                <div class="info-label">Proceso</div>
                                <div class="info-value">${cuadroData.nombreProceso}</div>
                            </div>` : ''}
                            ${cuadroData?.nombreServicio ? `<div class="info-card">
                                <div class="info-label">Servicio</div>
                                <div class="info-value">${cuadroData.nombreServicio}</div>
                            </div>` : ''}
                            ${cuadroData?.nombreSeccionServicio ? `<div class="info-card">
                                <div class="info-label">Sección Servicio</div>
                                <div class="info-value">${cuadroData.nombreSeccionServicio}</div>
                            </div>` : ''}
                            ${cuadroData?.nombreSubseccionServicio ? `<div class="info-card">
                                <div class="info-label">Subsección Servicio</div>
                                <div class="info-value">${cuadroData.nombreSubseccionServicio}</div>
                            </div>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    ${miembros && miembros.length > 0 ? `
                    <!-- Equipo de Trabajo -->
                    <div class="section">
                        <div class="section-title">👥 Equipo de Talento Humano (${miembros.length} miembros)</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre Completo</th>
                                    <th>Documento</th>
                                    <th>Perfiles</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${miembros.map(miembro => `
                                <tr>
                                    <td>${miembro.nombreCompleto || 'Nombre no disponible'}</td>
                                    <td>${miembro.documento || 'N/A'}</td>
                                    <td>${miembro.titulos?.join(', ') || 'Sin perfil definido'}</td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : '<div class="section"><div class="section-title">👥 Equipo de Trabajo</div><p>No se encontraron miembros para este equipo</p></div>'}

                    ${turnos && turnos.length > 0 ? `
                    <!-- Turnos Actuales -->
                    <div class="section">
                        <div class="section-title">⏰ Turnos del Cuadro (${turnos.length} turnos)</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha Inicio</th>
                                    <th>Fecha Fin</th>
                                    <th>Tipo Turno</th>
                                    <th>Jornada</th>
                                    <th>Total Horas</th>
                                    <th>Estado</th>
                                    <th>Comentarios</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${turnos.map(turno => `
                                <tr>
                                    <td>${turno.fechaInicio || 'N/A'}</td>
                                    <td>${turno.fechaFin || 'N/A'}</td>
                                    <td>${turno.tipoTurno || 'N/A'}</td>
                                    <td>${turno.jornada || 'N/A'}</td>
                                    <td>${turno.totalHoras || 'N/A'}</td>
                                    <td>
                                        <span class="${turno.estadoTurno === 'abierto' ? 'status-active' : 'status-inactive'}">
                                            ${turno.estadoTurno || 'N/A'}
                                        </span>
                                    </td>
                                    <td>${turno.comentarios || 'Sin comentarios'}</td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : '<div class="section"><div class="section-title">⏰ Turnos del Cuadro</div><p>No se encontraron turnos para este cuadro</p></div>'}

                    ${historialCuadro && historialCuadro.length > 0 ? `
                    <!-- Historial de Cambios del Cuadro -->
                    <div class="section">
                        <div class="section-title">📅 Historial de Cambios del Cuadro (${historialCuadro.length} registros)</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha Cambio</th>
                                    <th>Versión</th>
                                    <th>Estado</th>
                                    <th>Turno Excepción</th>
                                    <th>Categoría</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historialCuadro.map(h => `
                                <tr>
                                    <td>${h.fechaCambio || 'N/A'}</td>
                                    <td>${h.version || 'N/A'}</td>
                                    <td>
                                        <span class="${h.estadoCuadro === 'abierto' ? 'status-active' : 'status-inactive'}">
                                            ${h.estadoCuadro || 'N/A'}
                                        </span>
                                    </td>
                                    <td>${h.turnoExcepcion ? 'Sí' : 'No'}</td>
                                    <td>${h.categoria || 'N/A'}</td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}

                    ${historialTurnos && historialTurnos.length > 0 ? `
                    <!-- Historial de Cambios de Turnos -->
                    <div class="section">
                        <div class="section-title">🔄 Historial de Cambios de Turnos (${historialTurnos.length} registros)</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Fecha Cambio</th>
                                    <th>Tipo Turno</th>
                                    <th>Jornada</th>
                                    <th>Total Horas</th>
                                    <th>Estado</th>
                                    <th>Comentarios</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historialTurnos.map(ht => `
                                <tr>
                                    <td>${ht.fechaCambio || 'N/A'}</td>
                                    <td>${ht.tipoTurno || 'N/A'}</td>
                                    <td>${ht.jornada || 'N/A'}</td>
                                    <td>${ht.totalHoras || 'N/A'}</td>
                                    <td>
                                        <span class="${ht.estadoTurno === 'abierto' ? 'status-active' : 'status-inactive'}">
                                            ${ht.estadoTurno || 'N/A'}
                                        </span>
                                    </td>
                                    <td>${ht.comentarios || 'Sin comentarios'}</td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}
                </div>

                <div class="footer">
                    <p>Este correo ha sido generado automáticamente por el Sistema de Gestión Hospitalaria</p>
                    <p>Por favor, no responder a este correo</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Enviar notificación con datos simulados
    static async enviarNotificacionCambio(cuadroId, tipoOperacion, detallesOperacion) {
        try {
            // Obtener correos activos
            const correosActivos = await this.obtenerCorreosActivos();

            if (correosActivos.length === 0) {
                console.warn('No hay correos activos configurados para notificaciones');
                return;
            }

            // Datos simulados
            const cuadroData = {
                idCuadroTurno: cuadroId,
                nombre: `Cuadro de Enfermería - ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                version: '2.1',
                categoria: 'individual',
                mes: new Date().getMonth() + 1,
                anio: new Date().getFullYear(),
                estadoCuadro: 'abierto',
                turnoExcepcion: false,
                nombreMacroproceso: 'Atención en Salud',
                nombreProceso: 'Cuidado de Enfermería',
                nombreServicio: 'Hospitalización',
                nombreSeccionServicio: 'Medicina Interna',
                nombreSubseccionServicio: 'Piso 3'
            };

            const miembros = [
                {
                    idPersona: 1,
                    nombreCompleto: 'María García López',
                    documento: '12345678',
                    titulos: ['Enfermero(a) Profesional', 'Especialista en Cuidado Crítico']
                },
                {
                    idPersona: 2,
                    nombreCompleto: 'Juan Carlos Pérez',
                    documento: '87654321',
                    titulos: ['Auxiliar de Enfermería']
                },
                {
                    idPersona: 3,
                    nombreCompleto: 'Ana Sofía Rodríguez',
                    documento: '11223344',
                    titulos: ['Enfermero(a) Jefe', 'Magíster en Administración']
                }
            ];

            const turnos = [
                {
                    idTurno: 1,
                    fechaInicio: '2025-09-15 07:00:00',
                    fechaFin: '2025-09-15 19:00:00',
                    tipoTurno: 'Diurno',
                    jornada: 'Día',
                    totalHoras: 12.0,
                    estadoTurno: 'abierto',
                    comentarios: 'Turno regular - Sin novedades'
                },
                {
                    idTurno: 2,
                    fechaInicio: '2025-09-15 19:00:00',
                    fechaFin: '2025-09-16 07:00:00',
                    tipoTurno: 'Nocturno',
                    jornada: 'Noche',
                    totalHoras: 12.0,
                    estadoTurno: 'abierto',
                    comentarios: 'Turno nocturno - Refuerzo disponible'
                }
            ];

            const historialCuadro = [
                {
                    idCambioCuadro: 1,
                    fechaCambio: '2025-09-14 10:30:00',
                    version: '2.0',
                    estadoCuadro: 'abierto',
                    turnoExcepcion: false,
                    categoria: 'individual'
                },
                {
                    idCambioCuadro: 2,
                    fechaCambio: '2025-09-13 14:15:00',
                    version: '1.9',
                    estadoCuadro: 'cerrado',
                    turnoExcepcion: true,
                    categoria: 'individual'
                }
            ];

            const historialTurnos = [
                {
                    idCambio: 1,
                    fechaCambio: '2025-09-14 16:45:00',
                    tipoTurno: 'Diurno',
                    jornada: 'Día',
                    totalHoras: 12.0,
                    estadoTurno: 'modificado',
                    comentarios: 'Cambio de personal por ausentismo'
                }
            ];

            const procesos = cuadroData.categoria === 'multiproceso' ? [
                {
                    idProceso: 1,
                    nombre: 'Administración de Medicamentos',
                    detalle: 'Proceso de preparación y administración de medicamentos',
                    estado: true
                },
                {
                    idProceso: 2,
                    nombre: 'Control de Signos Vitales',
                    detalle: 'Monitoreo continuo de signos vitales',
                    estado: true
                }
            ] : [];

            // Generar contenido HTML
            const htmlContent = this.generarHTMLCorreo(
                cuadroData,
                miembros,
                turnos,
                historialCuadro,
                historialTurnos,
                procesos,
                tipoOperacion,
                detallesOperacion
            );

            // Preparar notificaciones - Marcar como automáticas
            const notificaciones = correosActivos.map(correo => ({
                correo: correo.correo,
                estado: true,
                estadoNotificacion: 'enviado',
                mensaje: htmlContent,
                permanente: correo.permanente,
                asunto: `🏥 ${tipoOperacion} - ${cuadroData.nombre}`,
                fechaEnvio: new Date().toISOString(),
                automatico: true,
                idCuadroTurno: cuadroId
            }));

            // Enviar notificaciones
            const resultado = await apiNotificacionService.notificaciones.enviarNotificacionesAutomaticas(notificaciones);

            return resultado;

        } catch (error) {
            console.error('❌ Error al enviar notificación automática:', error);
            throw error;
        }
    }
}
