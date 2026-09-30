# Modelo de datos inicial

## Entidades

| Entidad | Propósito | Campos clave |
| --- | --- | --- |
| `profiles` | Perfil privado del usuario | `user_id`, nombre, teléfono, estado |
| `breeders` | Criadero o unidad productiva | nombre, slug, historia, ubicación pública, verificación |
| `breeder_members` | Roles por criadero | criadero, usuario, rol |
| `species` | Catálogo de especies | nombre, código |
| `breeds` | Razas por especie | especie, nombre |
| `animals` | Identidad principal | CRIA360 ID, criadero, especie, raza, sexo, nacimiento, padre, madre, visibilidad |
| `animal_owners` | Historial de propiedad | animal, propietario, fechas, privacidad |
| `health_records` | Vacunas y controles | animal, tipo, fecha, profesional, verificación |
| `documents` | Evidencia almacenada | criadero/animal, tipo, archivo, visibilidad |
| `tags` | Placas QR/NFC | código público, animal, estado, activación |
| `listings` | Anuncios del marketplace | animal, precio, moneda, ubicación pública, estado |
| `inquiries` | Contactos de compradores | anuncio, remitente, estado |
| `subscriptions` | Plan y límites | criadero, plan, estado, periodo |
| `audit_events` | Historial de cambios sensibles | actor, acción, entidad, fecha |

## Reglas de acceso

- Activar RLS en todas las tablas expuestas.
- Un usuario solo administra criaderos presentes en `breeder_members`.
- La ficha pública se sirve mediante una vista o función con campos permitidos, nunca desde la tabla privada completa.
- Los documentos son privados por defecto y se entregan mediante URL firmada de corta duración.
- `service_role`/secret key solo se usa en el servidor y nunca se publica en el navegador.
- Las verificaciones solo pueden ser creadas por un rol autorizado y deben conservar evidencia de auditoría.

## Identidad pública

El código visible seguirá una forma legible, por ejemplo `CRIA-PE-00428`, pero las relaciones internas usarán UUID. El código del QR debe resolver a una ruta estable; no debe contener directamente datos personales.
