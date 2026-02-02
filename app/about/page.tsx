import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Términos y Condiciones</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <section>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Última actualización: Enero 2026
          </p>
          <h2 className="mb-3 text-xl font-semibold">
            1. Aceptación de los Términos
          </h2>
          <p>
            Bienvenido a Guía Puntana. Al acceder y utilizar esta plataforma,
            usted acepta expresamente estos Términos y Condiciones en su
            totalidad. Si no está de acuerdo con alguna parte de estos términos,
            le solicitamos que no utilice nuestros servicios.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            2. Naturaleza del Servicio
          </h2>
          <p>
            Guía Puntana es una plataforma gratuita de código abierto
            desarrollada por un equipo independiente de desarrolladores. Nuestro
            objetivo es facilitar la conexión entre prestadores de servicios,
            emprendedores y potenciales clientes mediante la publicación de
            información de contacto y datos promocionales.
          </p>
          <p className="mt-2">
            Esta plataforma funciona exclusivamente como un directorio
            informativo y un medio de contacto. No intermediamos, supervisamos
            ni participamos en las transacciones, contrataciones o acuerdos que
            puedan surgir entre los usuarios.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            3. Independencia y Neutralidad
          </h2>
          <p>
            Guía Puntana es un proyecto independiente sin vínculos políticos,
            gubernamentales, comerciales ni afiliaciones de ningún tipo.
            Operamos de manera autónoma y neutral, sin promover intereses
            particulares más allá de facilitar la conexión entre usuarios.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            4. Responsabilidades y Limitaciones
          </h2>
          <p>
            <strong>4.1. Limitación de Responsabilidad:</strong> Guía Puntana
            actúa únicamente como plataforma de difusión de información. No nos
            responsabilizamos por:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>
              La calidad, seguridad, legalidad o idoneidad de los servicios
              ofrecidos por los usuarios registrados
            </li>
            <li>
              Los resultados, daños, perjuicios o pérdidas derivadas de
              cualquier contratación o transacción realizada a través de
              contactos establecidos en la plataforma
            </li>
            <li>
              La veracidad, exactitud o actualización de la información
              publicada por los usuarios
            </li>
            <li>
              Conflictos, disputas o incumplimientos contractuales entre
              usuarios
            </li>
            <li>
              Daños directos, indirectos, incidentales o consecuenciales
              relacionados con el uso de la plataforma
            </li>
          </ul>
          <p className="mt-3">
            <strong>4.2. Responsabilidad del Usuario:</strong> Cada usuario es
            el único responsable de:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>La información que publica en la plataforma</li>
            <li>
              El cumplimiento de sus obligaciones profesionales y contractuales
            </li>
            <li>Verificar la idoneidad de los servicios que contrata</li>
            <li>Los acuerdos y transacciones que realice con otros usuarios</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            5. Uso de la Plataforma
          </h2>
          <p>
            <strong>5.1. Registro y Publicación:</strong> Los usuarios pueden
            registrarse gratuitamente y publicar información sobre sus servicios
            o emprendimientos. Al hacerlo, garantizan que la información
            proporcionada es veraz, legal y no infringe derechos de terceros.
          </p>
          <p className="mt-2">
            <strong>5.2. Prohibiciones:</strong> Queda prohibido utilizar la
            plataforma para:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>
              Publicar contenido ilegal, ofensivo, difamatorio o fraudulento
            </li>
            <li>
              Promover actividades ilegales o contrarias a la moral y buenas
              costumbres
            </li>
            <li>Suplantar identidades o proporcionar información falsa</li>
            <li>Realizar spam o prácticas comerciales abusivas</li>
            <li>Vulnerar la seguridad o integridad de la plataforma</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            6. Sistema de Verificación e Insignias
          </h2>
          <p>
            Guía Puntana puede otorgar insignias de &quot;Identidad
            Verificada&quot; o similares basándose en la documentación
            proporcionada voluntariamente por el usuario (ej. DNI, matrícula).
          </p>
          <p className="mt-2">
            <strong>6.1. Alcance:</strong> La insignia indica únicamente que, al
            momento de la revisión, el usuario presentó un documento que
            coincidía con sus datos de perfil.{' '}
            <strong>No constituye una garantía</strong> de solvencia moral,
            habilidad profesional, antecedentes penales limpios ni calidad del
            servicio.
          </p>
          <p className="mt-2">
            <strong>6.2. Privacidad de Documentos:</strong> Los documentos de
            identidad subidos para verificación son utilizados exclusivamente
            por el equipo de administración para este fin, se almacenan de forma
            privada y no son accesibles al público.
          </p>
          <p className="mt-2">
            <strong>6.3. Descargo:</strong> SimpleDevs no asume responsabilidad
            por actos ilícitos, mala praxis o incumplimientos cometidos por
            usuarios que posean una insignia de verificación. El cliente final
            sigue siendo el único responsable de evaluar la idoneidad del
            profesional antes de contratarlo.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            7. Moderación y Eliminación de Contenido
          </h2>
          <p>
            Nos reservamos el derecho de revisar, moderar, suspender o eliminar
            cualquier contenido o cuenta de usuario que:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>Viole estos Términos y Condiciones</li>
            <li>Infrinja derechos de terceros</li>
            <li>Sea considerado inapropiado o perjudicial para la comunidad</li>
            <li>Incumpla con la legislación vigente</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            8. Disponibilidad del Servicio
          </h2>
          <p>
            Si bien nos esforzamos por mantener la plataforma disponible, no
            garantizamos un funcionamiento ininterrumpido ni libre de errores.
            Podemos suspender, modificar o discontinuar el servicio en cualquier
            momento sin previo aviso.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">9. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos y Condiciones
            en cualquier momento. Las modificaciones entrarán en vigor
            inmediatamente después de su publicación en la plataforma. El uso
            continuado del servicio constituye la aceptación de los términos
            modificados.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">10. Indemnización</h2>
          <p>
            Los usuarios acuerdan indemnizar y mantener indemne a Guía Puntana,
            sus desarrolladores y colaboradores, frente a cualquier reclamación,
            daño, pérdida o gasto (incluyendo honorarios legales) que surja del
            uso de la plataforma o de la violación de estos términos.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">
            11. Jurisdicción y Ley Aplicable
          </h2>
          <p>
            Estos Términos y Condiciones se rigen por las leyes de la República
            Argentina. Cualquier disputa será sometida a los tribunales
            competentes de San Luis, Argentina.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">12. Contacto</h2>
          <p>
            Para consultas, reportes o sugerencias relacionadas con estos
            Términos y Condiciones o el funcionamiento de la plataforma, puede
            contactarnos a través de los medios disponibles.
          </p>
        </section>

        <section className="mt-8 border-t border-gray-300 pt-6 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Al utilizar Guía Puntana, usted reconoce haber leído, comprendido y
            aceptado estos Términos y Condiciones en su totalidad.
          </p>
        </section>
      </div>
    </div>
  );
}
