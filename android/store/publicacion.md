# Publicación y verificación · CRIA360

## Estado real

Código y recursos preparados. APK/AAB pendientes de compilación porque no se han aceptado las licencias del SDK. No hay una app creada ni un envío a revisión en Play Console. La cuenta seleccionada mostró la pantalla de registro de desarrollador el 11/10/2026.

## Secuencia para publicar

1. Habilitar la cuenta de desarrollador o acceder a una que ya exista. El propietario completa personalmente los acuerdos, verificación y pagos que solicite Google. Para cuentas nuevas, la cuota publicada de registro es única de USD 25; no es una suscripción.
2. Crear la aplicación CRIA360, Español (Perú), aplicación, gratuita. El propietario revisa y acepta las declaraciones y acuerdos que Play Console presente.
3. Copiar `ficha-es-PE.md`; completar un correo de soporte real y los enlaces de privacidad y eliminación.
4. Incorporar el icono PNG de 512 × 512 y la imagen destacada PNG de 1024 × 500. Obtener al menos dos capturas reales de la app instalada; no se incluyen montajes como si fueran capturas.
5. Completar Acceso a la app: facilitar a los revisores una cuenta de prueba con datos ficticios y acceso suficiente, sin compartir la cuenta administrativa ni claves de infraestructura. Crear esas credenciales cuando se vaya a enviar a revisión.
6. Completar clasificación de contenido, audiencia, anuncios y Seguridad de los datos conforme a las funciones y datos realmente tratados. Los borradores de este proyecto no sustituyen las declaraciones del propietario.
7. Tras autorizar las licencias del SDK, compilar, firmar y subir `app-release.aab` a Prueba interna. Activar Play App Signing y añadir su certificado SHA-256 de firma a la web.
8. Instalar desde el enlace de pruebas, completar la matriz siguiente y revisar el informe previo al lanzamiento.
9. Si aplica a una cuenta personal nueva, realizar la prueba cerrada con al menos **12 participantes inscritos continuamente durante 14 días** y solicitar acceso a producción. Google puede solicitar información y revisión adicional; completar esas condiciones no garantiza aprobación automática.
10. Enviar a revisión y publicar cuando Google apruebe. No anunciar disponibilidad en Play hasta tener un enlace de instalación público activo.

## Matriz mínima de prueba real

| Caso | Resultado esperado | Estado |
| --- | --- | --- |
| Instalar APK y versión de prueba de Play | Icono y nombre CRIA360; inicio sin error | Pendiente |
| Entrar con Google y correo | Sesión válida; volver al panel; sin bucles | Pendiente |
| Abrir sin sesión | Ingreso; inventario privado inaccesible | Pendiente |
| Registrar animal y ver tarjetas por especie | Registro persistido; imágenes de su especie | Pendiente |
| Registrar venta, compra y gasto | Monto/fecha correctos; resumen actualizado | Pendiente |
| Escanear QR, permiso concedido/denegado | Ficha válida o ayuda recuperable | Pendiente |
| NFC, con y sin soporte | Lectura compatible o indicación clara | Pendiente |
| Enlaces de animal y accesos rápidos | Abrir ruta correcta sin destinos externos no confiables | Pendiente |
| Cerrar sesión | Datos privados protegidos al reabrir | Pendiente |
| Mi cuenta y formulario de eliminación | Solicitud real visible solo para el administrador; identidad por verificar | Permisos de base de datos verificados; flujo móvil pendiente |
| Sin conexión | Mensaje de conexión; no pérdida silenciosa de registros | Pendiente |
| Volver, rotar, texto grande y zonas seguras | Navegación legible; controles utilizables | Pendiente |

## Borrador de Seguridad de los datos

Revisar formularios, fotografías, publicaciones, contenido web, analítica y dependencias antes de enviarlo. Declara lo que trata toda la experiencia web dentro de la TWA, no solo el Android manifest.

| Datos actuales | Uso | Revisión necesaria |
| --- | --- | --- |
| Nombre, correo e identificador de usuario | Acceso, perfil y soporte | Declarar recogida y finalidades; distinguir opcionales de obligatorios |
| Teléfono opcional y ubicación declarada del criadero | Perfil/contacto y publicaciones elegidas | Revisar alcance y exposición pública; no equivale a permiso GPS |
| Fotografías y registros del criadero | Inventario e identidad animal | Declarar contenido aportado por el usuario y fotografías |
| Ventas, compras y gastos | Gestión del criadero | Revisar categoría de información financiera y finalidad funcional |
| Mensajes de contacto y soporte | Atención y solicitudes de cierre | Declarar comunicaciones y retención |
| Analítica opcional tras consentimiento | Uso de la plataforma | Declarar actividad según implementación vigente; no marcar «no recoge datos» |
| Identificadores técnicos tratados por infraestructura | Seguridad y operación | Revisar Google, Supabase, Vercel y dependencias; no asumir ausencia de diagnósticos |

Conexión por HTTPS. Hay un mecanismo para solicitar eliminación de cuenta. Los proveedores de servicio y las publicaciones elegidas por el usuario deben evaluarse con las definiciones de recogida/compartición de Google Play. No marcar valores finales sin esa revisión.

No se ha integrado facturación para vender planes digitales dentro de la app. Añadir Google Play Billing y verificación en servidor antes de habilitar esas compras.
