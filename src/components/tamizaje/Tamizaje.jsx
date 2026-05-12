import { useEffect, useMemo, useState } from 'react';
import { useDisclourse } from '../../hooks/tamizaje/useDisclourse';
import { useGetTamizaje } from '../../hooks/tamizaje/useGetTamizaje';
import { getFormattedDate, getNextSevenDay, getSevenDayAgo, isPassedSeveDays, parseDate, parseDateHours } from '../helpers';
import { DropdownTableCols } from './DropdownTableCols';
import { DeleteBtn } from './DeleteBtn';
import { ModalReevaluate } from './ModalReevaluate';
import { ModalFinish } from './ModalFinish';

const OPTIONS = {
  REEVALUAR: 'REEVALUAR',
  INTERVENCION: 'REALIZAR INTERVENCION',
  TODOS: '',
};

function Tamizaje() {
  const { getTamizaje, data, loading, error } = useGetTamizaje();
  const [tableColums, setTableColums] = useState({
    age: true,
    gender: true,
    service: true,
    bethCode: true,
    bethDescription: true,
    income: true,
  });
  const { isOpen, onClose, onOpen } = useDisclourse();
  const { isOpen: isOpenFinish, onClose: onCloseFinish, onOpen: onOpenFinish } = useDisclourse();
  const [checksArr, setChecksArr] = useState([]);
  const [dateValueStart, setDateValueStart] = useState(getFormattedDate(getSevenDayAgo()));
  const [dateValueEnd, setDateValueEnd] = useState(getFormattedDate(new Date()));
  const [select, setSelect] = useState(OPTIONS.TODOS);

  useEffect(() => {
    if (!dateValueEnd || !dateValueStart) return;
    getTamizaje({
      fechaFinal: dateValueEnd,
      fechaInicial: dateValueStart,
    });
  }, [dateValueEnd, dateValueStart]);

  useEffect(() => {
    if (error) {
      console.error('error', error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) setChecksArr([]);
  }, [data]);

  const isCreated = useMemo(() => checksArr.some((inf) => inf.firstValue != null), [checksArr]);
  const isNew = useMemo(() => checksArr.some((inf) => inf.firstValue == null), [checksArr]);

  const handleChange = (value, key) => {
    setTableColums((p) => ({ ...p, [key]: value }));
  };

  const handleCopy = () => {
    if (checksArr.length === 0) return;
    let text = '';
    checksArr.forEach((info) => {
      text += `${info.documentNumber}\t${info.patient}\t${info.age}\t${info.gender}\t${info.bethDescription || '\t'}\t${info.bethCode || '\t'} \t ${info.incomeConsec}\t${`${parseDate(
        info.folioDate,
      )} ${parseDateHours(info.folioDate, true)}`}\t${info.valueNut}\t${info.firstValue || '\t'} \t${
        info.evaluationDate ? `${parseDate(info.evaluationDate)} ${parseDateHours(info.evaluationDate)}` : '\t'
      }\t${info.evaluationDate ? getNextSevenDay(info.evaluationDate) : '\t'}\t${info.secondValue || ''}\n`;
    });

    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };

  const clearChecks = () => setChecksArr([]);

  const arr =
    data?.filter((inf) => {
      if (!select) return true;
      return inf.valueNut.includes(select);
    }) || [];

  const sort = arr.sort((a, b) => {
    if (a?.close && !a.firstValue) return 1;
    if (b?.close && !b.firstValue) return -1;
    return new Date(a.folioDate).getTime() - new Date(b.folioDate).getTime();
  });

  return (
    <div className="">
      <div className="my-4 px-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo y título */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800">Tamizaje nutricional</h1>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Inputs de fecha */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label htmlFor="date-init" className="text-sm font-medium text-gray-700">
                  Inicio
                </label>
                <input id="date-init" type="date" value={dateValueStart}
                  onChange={(e) => {
                    setDateValueStart(e.target.value);
                    setDateValueEnd('');
                  }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              </div>

              <div className="flex flex-col">
                <label htmlFor="date-end" className="text-sm font-medium text-gray-700">
                  Fin
                </label>
                <input id="date-end" type="date" value={dateValueEnd}
                  onChange={(e) => setDateValueEnd(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
              </div>
            </div>

            {/* Select de estado */}
            <div className="flex flex-col">
              <label htmlFor="option-type" className="text-sm font-medium text-gray-700">
                Estado
              </label>
              <select id="option-type" value={select} onChange={(e) => setSelect(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                {Object.keys(OPTIONS).map((key) => (
                  <option key={key} value={OPTIONS[key]}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="my-2 px-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Dropdown y selección */}
          <div className="flex items-center gap-3">
            <DropdownTableCols handleChange={handleChange} tableColums={tableColums} />
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Seleccionados</span>
              {loading ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : `(${checksArr.length})`}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            <button disabled={loading || !data || checksArr.length === 0} onClick={handleCopy}
              className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Copiar
            </button>

            <button disabled={loading || !data || checksArr.length === 0 || isCreated} onClick={onOpen}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Reevaluar
            </button>

            <button disabled={loading || !data || checksArr.length === 0 || isNew || checksArr.some((inf) => inf.close)}
              onClick={onOpenFinish}
              className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Finalizar
            </button>

            <DeleteBtn disabled={checksArr.length !== 1 || checksArr?.[0]?.firstValue == null} info={checksArr?.[0]} clearChecks={clearChecks} 
              refetch={() => {
                getTamizaje({
                  fechaFinal: dateValueEnd,
                  fechaInicial: dateValueStart,
                });
              }}
            />
          </div>

          {/* Total de exámenes */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Total exámenes</span>
            {loading || !data ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <span className="ml-2">{arr.length}</span>}
          </div>
        </div>
      </div>

      <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)', maxWidth: 'calc(100vw - 300px)' }}>
        <table className="w-full text-xs uppercase min-w-full border border-collapse border-gray-300">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="sticky left-0 bg-gray-200 px-3 border border-gray-300">
                <input type="checkbox" checked={checksArr.length === arr.length}
                  onChange={(e) => {
                    setChecksArr(e.target.checked ? arr || [] : []);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
              </th>
              <th className="min-w-[20ch] bg-gray-100 border border-gray-300">HC</th>
              <th className="min-w-[40ch] bg-gray-100 border border-gray-300">PACIENTE</th>
              {tableColums.age && <th className="bg-gray-100 border border-gray-300">EDAD</th>}
              {tableColums.gender && <th className="bg-gray-100 border border-gray-300">GÉNERO</th>}
              {tableColums.service && <th className="min-w-[20ch] bg-gray-100 border border-gray-300">SERVICIO</th>}
              {tableColums.bethCode && <th className="bg-gray-100 border border-gray-300">CAMA</th>}
              {tableColums.income && <th className="bg-gray-100 border border-gray-300">INGRESO</th>}
              <th className="min-w-[20ch] bg-gray-100 border border-gray-300">FECHA FOLIO</th>
              <th className="bg-gray-100 border border-gray-300">VALOR</th>
              <th className="bg-gray-100 border border-gray-300">PRIMERA EVALUACIÓN</th>
              <th className="bg-gray-100 border border-gray-300">FECHA 1RA EVALUACIÓN</th>
              <th className="bg-gray-100 border border-gray-300">PRÓXIMA EVALUACIÓN</th>
              <th className="bg-gray-100 border border-gray-300">SEGUNDA EVALUACIÓN</th>
              <th className="border border-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="100%" className="border border-gray-300">
                  <div className="flex items-center justify-center w-full h-full" style={{ minHeight: '40vh' }}>
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : (
              sort.map((info) => (
                <tr key={info.id} className={`text-center 
                  ${checksArr.some((inf) => inf.id === info.id) ? 'bg-blue-100' : ''}
                  ${info?.close && !info.firstValue ? 'bg-gray-200' : ''}
                  ${!info.secondValue && !info.close && info.evaluationDate && isPassedSeveDays(info.evaluationDate) ? 'bg-yellow-200 animate-pulse' : ''}
                `}>
                  <td className="sticky left-0 bg-white px-3 border border-gray-300">
                    <input type="checkbox" checked={checksArr.some((inf) => inf.id === info.id)}
                      onChange={(e) => {
                        setChecksArr((prev) => (e.target.checked ? [...prev, info] : prev.filter((it) => it.id !== info.id)));
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  </td>
                  <td className="border border-gray-300">{info.documentNumber}</td>
                  <td className="border border-gray-300" title={info.patient}>
                    {info.patient}
                  </td>
                  {tableColums.age && <td className="border border-gray-300">{info.age}</td>}
                  {tableColums.gender && <td className="border border-gray-300">{info.gender}</td>}
                  {tableColums.service && (
                    <td className="border border-gray-300" title={info.bethDescription}>
                      <div className="max-w-[20ch] truncate">{info.bethDescription}</div>
                    </td>
                  )}
                  {tableColums.bethCode && <td className="border border-gray-300">{info.bethCode}</td>}
                  {tableColums.income && <td className="border border-gray-300">{info.incomeConsec}</td>}
                  <td className="border border-gray-300">
                    {parseDate(info.folioDate)} {parseDateHours(info.folioDate, true)}
                  </td>
                  <td className={`border border-gray-300 ${info.firstValue && info.valueNut !== info.firstValue ? 'bg-red-500 text-white' : ''}`} title={info.valueNut}>
                    <div className="max-w-[20ch] truncate">{info.valueNut}</div>
                  </td>
                  <td className="border border-gray-300" title={info.firstValue}>
                    <div className="max-w-[20ch] truncate">{info.firstValue || ' '}</div>
                  </td>
                  <td className="border border-gray-300">{info.evaluationDate ? `${parseDate(info.evaluationDate)} ${parseDateHours(info.evaluationDate)}` : ''}</td>
                  <td className="border border-gray-300">{info.evaluationDate && info.firstValue ? getNextSevenDay(info.evaluationDate) : ''}</td>
                  <td className="border border-gray-300" title={info.secondValue}>
                    <div className="max-w-[20ch] truncate">{info.secondValue || ' '}</div>
                  </td>
                  <td className="border border-gray-300">
                    {info.usuerName && (
                      <div className="group relative flex justify-center">
                        <span className="text-blue-600 cursor-pointer">ℹ️</span>
                        <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">{info.usuerName}</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isOpen && checksArr.length > 0 && (
        <ModalReevaluate checksArr={checksArr} isOpen={isOpen} onClose={onClose} aria-modal
          refetch={() => {
            getTamizaje({
              fechaFinal: dateValueEnd,
              fechaInicial: dateValueStart,
            });
          }}
          clearChecks={clearChecks}
        />
      )}
      {isOpenFinish && checksArr.length > 0 && (
        <ModalFinish checksArr={checksArr} isOpen={isOpenFinish} onClose={onCloseFinish} aria-modal
          refetch={() => {
            getTamizaje({
              fechaFinal: dateValueEnd,
              fechaInicial: dateValueStart,
            });
          }}
          clearChecks={clearChecks} />
      )}
    </div>
  );
}

export default Tamizaje;