# CRIA360

Plataforma integral para criaderos: identidad digital, genealogía, salud, trazabilidad y marketplace animal.

## Propuesta de valor

Cada animal recibe un **CRIA360 ID** asociado a una placa QR/NFC. Al escanearla se abre una ficha pública protegida con los datos autorizados por el criador: procedencia, padres, fecha de nacimiento, salud, documentos e historial. Los datos sensibles del propietario permanecen privados.

## Módulos del producto

- **CRIA360 ID:** identidad única y placa QR/NFC.
- **Gestión:** inventario, propietarios, sedes y movimientos.
- **Genealogía:** padres, madres y árbol generacional.
- **Salud:** vacunas, controles, restricciones y documentos.
- **CRIA360 Market:** perfiles de criaderos y anuncios con trazabilidad.

## Stack

- Next.js 16, React 19, TypeScript y Tailwind CSS 4.
- Supabase para Postgres, Auth, Storage y políticas RLS.
- Vercel para despliegue, dominios y analítica.

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

La interfaz actual utiliza datos demostrativos. La conexión con Supabase se realizará después de crear y enlazar el proyecto remoto.

## Principios

- Los registros distinguen entre datos declarados y datos verificados.
- La ubicación exacta y los datos personales no aparecen en perfiles públicos.
- El marketplace admite crianza y comercialización lícitas; no admite apuestas, organización de peleas ni contenido que promueva daño animal.
- Una ficha CRIA360 no se presenta como certificado oficial salvo validación de la autoridad correspondiente.
