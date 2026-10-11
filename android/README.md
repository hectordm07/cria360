# CRIA360 Android · 1.0.0

Proyecto Android para distribuir CRIA360 en Google Play mediante Trusted Web Activity de Google. Abre el panel móvil existente y comparte la sesión del navegador compatible. No utiliza un WebView embebido para iniciar sesión con Google.

## Estado

Código Android preparado; pendiente compilar y probar en un dispositivo. No se ha generado APK ni AAB, ni enviado una versión a Google Play. La aceptación de licencias del SDK Android está pendiente de autorización explícita. La cuenta elegida en Play Console presenta la pantalla de registro de desarrollador.

## Identidad estable

- Nombre: **CRIA360**.
- Paquete: **app.cria360.android**. No cambiarlo después de la primera carga en Google Play.
- Versión: **1.0.0**, código **1**; incrementar el código en cada publicación.
- Android mínimo: **8.0 / API 26**.
- Android objetivo: **16 / API 36**.
- Inicio: `https://cria360.vercel.app/cuenta`.
- Android Browser Helper: **2.7.4**; Android Gradle Plugin **8.13.2**; Gradle **8.13**; Java **17**.

## Compilación

1. Instalar Java 17 y Android SDK desde Android Studio o las herramientas oficiales de Google. El titular debe revisar y autorizar las licencias del SDK. Este proyecto no acepta licencias automáticamente.
2. Instalar `platforms;android-36`, `build-tools;36.0.0` y `platform-tools`. Configurar `ANDROID_HOME` o el archivo local no versionado `local.properties` con `sdk.dir=/ruta/al/sdk`.
3. Configurar las variables privadas `CRIA360_KEYSTORE_PATH`, `CRIA360_KEYSTORE_PASSWORD`, `CRIA360_KEY_PASSWORD` y, si cambia, `CRIA360_KEY_ALIAS` (valor predeterminado: `cria360-upload`). Guardar la clave y contraseñas fuera del repositorio.
4. Desde `android/`, ejecutar `./gradlew lintRelease assembleRelease bundleRelease`. Nunca utilizar una clave de depuración para la versión de publicación.
5. APK instalable: `app/build/outputs/apk/release/app-release.apk`. Paquete para Play Console: `app/build/outputs/bundle/release/app-release.aab`.
6. Verificar el APK con `apksigner verify --print-certs` y el AAB con `jarsigner -verify`. Instalar y completar la matriz de pruebas de `store/publicacion.md` antes de enviar a revisión.

## Firma y pantalla completa

La clave de carga se entrega como respaldo privado separado. El certificado público de esa clave está en `../public/.well-known/assetlinks.json`; no concede acceso a la base de datos. Permite verificar la web para el APK firmado con esa misma clave.

Al activar **Play App Signing**, Google suele utilizar un certificado de firma de aplicación diferente al de carga. Copiar su huella **SHA-256 de firma de aplicación** desde Play Console → Integridad de la aplicación y añadirla al array `sha256_cert_fingerprints` del archivo público. Conservar también la huella de carga si se usarán APK instalados manualmente. Publicar ese cambio en la web antes de probar la versión distribuida por Play. Sin la huella correcta, Chrome mostrará su barra de navegador; no desactivar la verificación para ocultarla.

Mantener el certificado público accesible por HTTPS sin redirecciones en `https://cria360.vercel.app/.well-known/assetlinks.json`. Si CRIA360 cambia de dominio, actualizar la URL, el host del manifest, los shortcuts, los asset statements y la verificación de ambos dominios de forma coordinada.

## Primera versión gratuita

Incluye el plan gratuito existente y funciones ya disponibles: inventario, registro de animales, publicaciones, ventas, compras, gastos, identidad QR y NFC cuando el dispositivo/navegador lo admite. Requiere conexión para consultar y guardar datos del criadero. No se promete uso sin conexión de los datos privados.

No hay compras digitales integradas en esta versión. Implementar y verificar Google Play Billing, validación de compras en servidor y gestión de derechos antes de habilitar cobros de suscripciones digitales dentro de la app. La disponibilidad de planes, límites y precios depende de la plataforma existente.

## Datos y cierre de cuenta

La cámara/NFC se solicitan en la experiencia web cuando se utiliza la función; el Android manifest declara Internet y no pide contactos, SMS, ubicación precisa ni acceso general al almacenamiento. Revisar el manifest combinado tras compilar porque las dependencias pueden incorporar declaraciones adicionales.

En la app: **Mi cuenta → Solicitar eliminación de cuenta**. Recurso público, también sin sesión: `https://cria360.vercel.app/eliminar-cuenta`. El formulario registra una solicitud real en la bandeja privada existente `public_contact_messages`; no elimina una cuenta automáticamente ni permite a otra persona hacerlo solo con el correo.

El administrador debe revisar esa bandeja, verificar al titular, exportar datos si lo solicita, revocar sesiones y retirar los datos personales y archivos asociados de forma coordinada. Revisar relaciones y registros compartidos antes de ejecutar eliminaciones; eliminar únicamente datos del titular verificado. No basta con borrar el usuario de Auth, y un JWT ya emitido puede seguir vigente hasta su vencimiento. Comunicar las excepciones legales y retenciones aplicables y confirmar el cierre. Este proceso manual debe estar operativo antes de publicar.

## Limitaciones pendientes

- Sin pruebas todavía en un teléfono Android real ni informe previo al lanzamiento de Google Play.
- Faltan al menos dos capturas reales de la app, con datos de prueba sin datos personales.
- Falta el certificado de firma de aplicación generado por Google Play.
- La cuenta de desarrollador debe estar habilitada y sus verificaciones completadas.
- El nombre técnico del dominio Supabase en el selector de Google se configura por separado en Google Cloud/Supabase; el empaquetado Android no lo cambia.

Documentación oficial consultada el 11 de octubre de 2026: [TWA](https://developer.chrome.com/docs/android/trusted-web-activity), [API objetivo](https://support.google.com/googleplay/android-developer/answer/11926878), [eliminación de cuenta](https://support.google.com/googleplay/android-developer/answer/13327111), [recursos de ficha](https://support.google.com/googleplay/android-developer/answer/9866151), [requisitos de pruebas](https://support.google.com/googleplay/android-developer/answer/14151465).
