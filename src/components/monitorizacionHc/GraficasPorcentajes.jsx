import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import Loader from '../Loader';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import useFetchPorcentajesByDates from '../../hooks/monitorizacionHC/useFetchDataRespByDateAndTipoPregunta';
import useFetchDataByProServTipoPregunta from '../../hooks/monitorizacionHC/useFetchDataByProServTipoPregunta';
import useFechDataByGrupoResumen from '../../hooks/monitorizacionHC/useFechDataByGrupoResumen';
import useFetchResumenRespuByPregunta from '../../hooks/monitorizacionHC/useFetchResumenRespuByPregunta';
import { obtenerTipoPreguntas } from '../../api/monitorizacionHc/preguntasService';

function GraficasPorcentajes({ procesosServicios }) {
  const { porcentajes, setPorcentajes, loading: loadingTodo, error: errorTodo, fetchPorcentajesByDates } = useFetchPorcentajesByDates();

  const { data: dataGf1, setData: setDataGf1, loading: loadingGf1, error: errorGf1, fetchDataByProServTipoPregunta } = useFetchDataByProServTipoPregunta();
  const { data: dataGf2, setData: setDataGf2, loading: loadingGf2, error: errorGf2, fetchDataByGrupoResumen } = useFechDataByGrupoResumen();
  const { data: dataTbl, setData: setDataTbl, error: errorTbl, loading: loadingTbl, fetchResumenRespuByPregunta } = useFetchResumenRespuByPregunta();

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [selectProserSeleccionado, setSelectProserSeleccionado] = useState(null);
  const [selectTipoPregunta, setSelectTipoPregunta] = useState(null);
  const [selectTipoGrafica, setSelectTipoGrafica] = useState(null);
  const [tipoPregunta, setTipoPregunta] = useState([]);

  // Cambia el título de la página al cargar el componente
  useEffect(() => {
    document.title = 'Monitorición HC - Reportes de Porcentajes';
  }, []);

  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  //traer los tipos de preguntas para el select
  useEffect(() => {
      if (tipoPregunta.length > 0)
        return;
      const llamarTipoPreguntas = async () => {
        const respuesta = await obtenerTipoPreguntas();
        setTipoPregunta(respuesta);
      }
      llamarTipoPreguntas();
    },[])

  // si cambia algun input o se selecciona un proceso/servicio, resetea los datos de los gráficos
  useEffect(() => {
    setDataGf1([]);
    setDataGf2([]);
    setPorcentajes([]);
    setDataTbl([]);
  }, [fechaDesde, fechaHasta, selectProserSeleccionado, selectTipoPregunta, selectTipoGrafica]);

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (fechaDesde === '' || fechaHasta === '') {
      alert('Por favor, complete ambos campos de fecha.');
      return;
    }
    if (fechaDesde > fechaHasta) {
      alert('La fecha inicial no puede ser mayor o igual a la fecha final.');
      return;
    }
    const fechaActual = new Date();
    const mesActual = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}`;
    if (fechaDesde > mesActual || fechaHasta > mesActual) {
      alert('Las fechas no pueden ser de meses posteriores al mes actual.');
      return;
    }
    if (!selectProserSeleccionado) {
      alert('Por favor, seleccione un Proceso/Servicio.');
      return;
    }

    // Realizar la llamada con fechas válidas
    if (selectProserSeleccionado.label == 'TODO') {
      fetchPorcentajesByDates(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split('-')[0], fechaHasta.split('-')[1])}`, selectTipoPregunta);
    }
    if (selectProserSeleccionado != null && selectTipoGrafica == 'resumenGrupo') {
      const procesoId = selectProserSeleccionado.tipo === 'PROCESO' ? selectProserSeleccionado.value : null;
      const servicioId = selectProserSeleccionado.tipo === 'SERVICIO' ? selectProserSeleccionado.value : null;
      fetchDataByProServTipoPregunta(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split('-')[0], fechaHasta.split('-')[1])}`, procesoId, servicioId, selectTipoPregunta);
    }
    if (selectProserSeleccionado != null && selectTipoGrafica == 'grupoMesCantidad') {
      const procesoId = selectProserSeleccionado.tipo === 'PROCESO' ? selectProserSeleccionado.value : null;
      const servicioId = selectProserSeleccionado.tipo === 'SERVICIO' ? selectProserSeleccionado.value : null;
      fetchDataByGrupoResumen(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split('-')[0], fechaHasta.split('-')[1])}`, procesoId, servicioId, selectTipoPregunta);
    }
    if (selectProserSeleccionado != null && selectTipoGrafica == 'tablaResumenPreguntas') {
      const procesoId = selectProserSeleccionado.tipo === 'PROCESO' ? selectProserSeleccionado.value : null;
      const servicioId = selectProserSeleccionado.tipo === 'SERVICIO' ? selectProserSeleccionado.value : null;
      fetchResumenRespuByPregunta(`${fechaDesde}-01`, `${fechaHasta}-${getLastDayOfMonth(fechaHasta.split('-')[0], fechaHasta.split('-')[1])}`, procesoId, servicioId, selectTipoPregunta);
    }
  };

  // Opciones para el select de procesos y servicios
  const opcionesServicios = [{ value: 0, label: 'TODO', tipo: 'TODO' }, ...procesosServicios];

  // Maneja el cambio de selección del servicio o proceso
  const handleProServChange = (seleccion) => {
    setSelectProserSeleccionado(seleccion);
    if (seleccion.tipo === 'TODO') {
      setSelectTipoGrafica(null);
    } else {
      setSelectTipoGrafica('');
    }
  };

  // Maneja el cambio del tipo de pregunta (MEDICO, ENFERMERIA)
  const handleTipoPregunta = (e) => {
    const { value } = e.target;
    if (value != 'TODO') {
      setSelectTipoPregunta(value);
    } else {
      setSelectTipoPregunta(null);
    }
  };

  if (errorTodo) return <div className="alert alert-danger">Error al cargar los datos: {errorTodo.message}</div>;

  // Transformar los datos para que cada fila sea un mes con todos los grupos como propiedades
  const transformData = (data) => {
    if (!data || data.length === 0) return [];
    const groupedByMonth = {};
    data.forEach(({ mes, grupo, porcentaje }) => {
      if (!groupedByMonth[grupo]) groupedByMonth[grupo] = { grupo };
      groupedByMonth[grupo][mes] = porcentaje;
    });
    // Convertimos el objeto a array y ordenamos por mes
    return Object.values(groupedByMonth).sort((a, b) => a.grupo.localeCompare(b.mes));
  };

  const chartData = transformData(dataGf2);

  // Extraer nombres únicos de grupos
  const groupNames = [...new Set(dataGf2.map((d) => d.mes))];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c', '#d0ed57', '#d88884', '#ad82ca', '#84d888', '#de6ca4', '#57d0ed', '#7f50ff'];

  const grupos =
    dataTbl?.reduce((acc, item) => {
      if (!acc[item.grupo]) acc[item.grupo] = [];
      acc[item.grupo].push(item);
      return acc;
    }, {}) || {};

  return (
    <div className="w-full p-4">
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full p-4 rounded-lg bg-white shadow">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Fecha Inicial */}
          <div className="flex items-center gap-2">
            <label htmlFor="fechaDesde" className="text-sm font-medium text-gray-700">
              Fecha Inicial
            </label>
            <input type="month" id="fechaDesde" name="fechaDesde" onChange={(e) => setFechaDesde(e.target.value)} required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"/>
          </div>

          {/* Fecha Final */}
          <div className="flex items-center gap-2">
            <label htmlFor="fechaHasta" className="text-sm font-medium text-gray-700">
              Fecha Final
            </label>
            <input type="month" id="fechaHasta" name="fechaHasta" onChange={(e) => setFechaHasta(e.target.value)} required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500"/>
          </div>

          {/* Tipo Pregunta */}
          <div className="flex items-center gap-2">
            <label htmlFor="tipoPregunta" className="text-sm font-medium text-gray-700">
              Tipo pregunta:
            </label>
            <select id="tipoPregunta" name="tipoPregunta" onChange={handleTipoPregunta} required
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500">
              <option value="">Seleccione una opción</option>
              <option value="TODO">TODO</option>
              {tipoPregunta.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Servicio / Proceso */}
          <div className="flex items-center gap-2 min-w-[300px]">
            <label htmlFor="servicio" className="text-sm font-medium text-gray-700">
              Servicio / Proceso
            </label>
            <Select options={opcionesServicios} onChange={handleProServChange} className="w-full" placeholder="Seleccione un Proceso/Servicio" required />
          </div>

          {/* Tipo de gráfica */}
          {selectTipoGrafica != null && (
            <div className="flex items-center gap-2">
              <label htmlFor="tipoGrafica" className="text-sm font-medium text-gray-700">
                Tipo de Gráfica
              </label>
              <select id="tipoGrafica" name="tipoGrafica" value={selectTipoGrafica} onChange={(e) => setSelectTipoGrafica(e.target.value)} required
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500">
                <option value="">Seleccione una opción</option>
                <option value="resumenGrupo">Resumen entre fechas por grupo</option>
                <option value="grupoMesCantidad">Comparativo mensual por grupo</option>
                <option value="tablaResumenPreguntas">Tabla Resumen de Preguntas</option>
              </select>
            </div>
          )}

          {/* Botón submit */}
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">
            Enviar
          </button>
        </div>
      </form>

      {/* Loader */}
      {(loadingTodo || loadingGf1 || loadingGf2 || loadingTbl) && <Loader />}

      {/* Errores */}
      {errorTodo && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">Error al cargar los datos: {errorTodo.message}</div>}
      {errorGf1 && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">Error al cargar los datos del gráfico 1: {errorGf1.message}</div>}
      {errorGf2 && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">Error al cargar los datos del gráfico 2: {errorGf2.message}</div>}
      {errorTbl && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">Error al cargar los datos de la tabla: {errorTbl.message}</div>}

      {/* Gráfica porcentajes */}
      {porcentajes.length > 0 && (
        <div className="w-full mt-6 p-4 rounded-lg bg-white shadow">
          <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">Porcentajes de Respuestas</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={porcentajes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="porcentaje" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Resumen porcentajes */}
      {dataGf1.length > 0 && (
        <div className="w-full mt-6">
          <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">Resumen de Porcentajes</h2>
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart data={dataGf1} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grupo" angle={-45} textAnchor="end" interval={0} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="cantidadSi" stackId="a" fill="#82ca9d" name="Sí" />
              <Bar yAxisId="left" dataKey="cantidadNo" stackId="a" fill="#ff7f7f" name="No" />
              <Bar yAxisId="left" dataKey="cantidadNoAplica" stackId="a" fill="#ccc" name="No Aplica" />
              <Line yAxisId="right" type="monotone" dataKey="porcentaje" stroke="#8884d8" name="%" />
            </ComposedChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataGf1} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grupo" angle={-45} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidadSi" stackId="a" fill="#82ca9d" name="Sí" />
              <Bar dataKey="cantidadNo" stackId="a" fill="#ff7f7f" name="No" />
              <Bar dataKey="cantidadNoAplica" stackId="a" fill="#ccc" name="No Aplica" />
              <Bar dataKey="porcentaje" stackId="a" fill="#3377ff" name="Porcentaje" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Comparativo mensual */}
      {dataGf2.length > 0 && (
        <div className="w-full mt-6">
          <h2 className="text-center text-lg font-semibold text-gray-700 mb-4">Comparativo Mensual por Grupo</h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grupo" angle={-45} textAnchor="end" interval={0} height={100} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v?.toFixed(2)}%`} />
              <Legend />
              {groupNames.map((mes, i) => (
                <Bar key={mes} dataKey={mes} fill={colors[i % colors.length]} name={mes} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabla */}
      {dataTbl.length > 0 && (
        <div className="w-full mt-6">
          <table className="w-full text-xs uppercase min-w-full border border-collapse border-gray-300">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2 text-left">Grupo</th>
                <th className="border px-4 py-2 text-left">Pregunta</th>
                <th className="border px-4 py-2 text-center">Cantidad Sí</th>
                <th className="border px-4 py-2 text-center">Cantidad No</th>
                <th className="border px-4 py-2 text-center">Cantidad No Aplica</th>
                <th className="border px-4 py-2 text-center">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(grupos).map((grupo) => {
                const items = grupos[grupo];
                return items.map((item, index) => (
                  <tr key={grupo + index} className="hover:bg-gray-50">
                    {index === 0 && (
                      <td rowSpan={items.length} className="border px-4 py-2 font-medium">
                        {grupo}
                      </td>
                    )}
                    <td className="border px-4 py-2">{item.pregunta}</td>
                    <td className="border px-4 py-2 text-center">{item.cantidadSi}</td>
                    <td className="border px-4 py-2 text-center">{item.cantidadNo}</td>
                    <td className="border px-4 py-2 text-center">{item.cantidadNoAplica}</td>
                    <td className="border px-4 py-2 text-center">{item.porcentaje.toFixed(2)}%</td>
                  </tr>
                ));
              })}
              <tr className="bg-gray-50 font-semibold text-center">
                <td></td>
                <td>Total</td>
                <td>{dataTbl.reduce((acc, i) => acc + i.cantidadSi, 0)}</td>
                <td>{dataTbl.reduce((acc, i) => acc + i.cantidadNo, 0)}</td>
                <td>{dataTbl.reduce((acc, i) => acc + i.cantidadNoAplica, 0)}</td>
                <td>{`${((dataTbl.reduce((acc, i) => acc + i.cantidadSi, 0) / dataTbl.reduce((acc, i) => acc + i.cantidadSi + i.cantidadNo, 0)) * 100).toFixed(2)}%`}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-2 text-sm text-gray-600">
            <p>{`Numerador: ${dataTbl.reduce((acc, i) => acc + i.cantidadSi, 0)}`}</p>
            <p>{`Denominador: ${dataTbl.reduce((acc, i) => acc + i.cantidadSi + i.cantidadNo, 0)}`}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GraficasPorcentajes;
