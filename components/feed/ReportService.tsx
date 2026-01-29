import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ServiceWithProfile } from '../../app/lib/definitions';
import { useBodyScrollLock } from '@/utils/hooks/useBodyScrollLock';


interface Props {
    service: ServiceWithProfile;
}

interface Report {
    servicios_id: string;
    motivo: string;
}

const ReportService: React.FC<Props> = ({ service }) => {
    const supabase = createClient();


    const [showReport, setShowReport] = useState(false);
    const [reason, setReason] = useState('');

    // Bloquear el scroll del body cuando el modal de reporte está abierto
    useBodyScrollLock(showReport);

    function onClose(): void {
        setShowReport(false);
        setReason('');
    }
    async function handleReport(): Promise<void> {
        const report: Report = { motivo: reason, servicios_id: service.id };
        const { data, error } = await supabase.from('reportes').insert([report]);
        if (error) {
            // Manejo de errores comentado para que el cliente final no vea detalles técnicos, descomentar para debuggear!
            // console.error('Error reporting service:', error);
        }
        onClose();
    }
    return (
        <>
            { //render condicional del popup de reporte
                showReport && (
                    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 py-5 " onClick={onClose}>
                        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 overscroll-contain" onClick={(e) => e.stopPropagation()}>
                            <div>
                                <h2 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white px-6 pt-6 mb-4">
                                    Estas seguro de que deseas denunciar <span className='text-orange-600'>{service.nombre.trimEnd()}</span>, publicado por <span className='text-orange-600'>{service.proveedor.nombre_completo.trimEnd()}</span>?
                                </h2>
                            </div>
                            <div>
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white px-6 ">
                                    Cuentanos que salio mal:
                                </h3>
                            </div>
                            <div className='flex  flex-col gap-4 mb-4 py-4 px-6 font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800'>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-3 rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 focus:border-orange-500 focus:ring-0 text-gray-700 dark:text-gray-200"
                                >
                                    <option value="">Selecciona una razón</option>
                                    <option value="Contenido inapropiado">Contenido inapropiado</option>
                                    <option value="Estafa">Información falsa</option>
                                    <option value="Spam">Spam o publicidad no deseada</option>
                                    {/* <option value="Otro?">Otro</option> */}
                                </select>
                                <div className='flex items-center justify-space-around gap-4'>
                                    <button
                                        disabled={!reason}
                                        onClick={handleReport}
                                        className={!reason ? "flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gray-400 py-4 text-lg font-bold text-white shadow-lg shadow-gray-400/20 transition-all cursor-not-allowed" : "flex flex-1 items-center justify-center gap-3 rounded-2xl bg-orange-600 py-4 text-lg font-bold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700"}
                                    > Denunciar
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:border-orange-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-orange-500"
                                    >Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div >)
            }

            {/* div que contiene el boton de denunciar que aparece en el modal */}
            <div
                onClick={() => setShowReport(true)}
                className=" mr-6 mb-3 text-gray-500 transition-colors hover:text-orange-600 hover:cursor-pointer dark:hover:text-white"
                aria-label="Close modal"
            >
                denunciar
            </div>
        </>
    )
}

export default ReportService;