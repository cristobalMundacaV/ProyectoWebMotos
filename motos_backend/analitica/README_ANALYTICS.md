# Analitica y Tracking - Contratos de API

## 1) Tracking de catalogo

### Endpoint
`POST /api/analitica/catalogo/eventos/`

### Body
```json
{
  "tipo_evento": "view_detail",
  "tipo_entidad": "moto",
  "entidad_id": 12,
  "entidad_slug": "r625",
  "entidad_nombre": "Voge R625",
  "session_id": "sess_123",
  "origen": "/motos/r625",
  "metadata": {
    "marca": "Voge",
    "categoria": "Naked"
  }
}
```

### Respuesta
```json
{ "ok": true }
```

## 2) Dashboard analitico de catalogo (admin)

### Endpoint
`GET /api/analitica/dashboard/catalogo/?start=YYYY-MM-DD&end=YYYY-MM-DD`

### Respuesta principal
- `total_views`
- `most_viewed_moto`
- `top_5_entidades`
- `trend_by_day`
- `trend_by_month`
- `trend_by_year`

## 3) Dashboard analitico de mantenciones (admin)

### Endpoint
`GET /api/analitica/dashboard/mantenciones/?year=YYYY&month=MM`

### Respuesta principal
- `kpis_mensuales.total_agendadas_mes`
- `kpis_mensuales.ocupacion_pct`
- `kpis_mensuales.horas_peak`
- `kpis_mensuales.servicios_mas_solicitados`
- `kpis_mensuales.tasa_no_asistencia_pct`
- `kpis_mensuales.tasa_cancelacion_pct`
- `kpis_mensuales.crecimiento_mensual_pct`
- `agendadas_ultimos_12_meses`
- `horas_peak_top_6`

## 4) Estados de mantencion para analitica

- `ingresada`
- `aceptada`
- `en_revision`
- `en_proceso`
- `esperando_repuestos`
- `finalizada`
- `entregada`
- `cancelada`
- `no_asistio`

## 5) Historial de estados

Se registra en `MantencionEstadoHistorial`:
- `estado_anterior`
- `estado_nuevo`
- `changed_by`
- `fuente` (`portal_cliente`, `admin_panel`, `api`)
- `changed_at`

Permite calcular conversiones por etapa, tiempos entre estados y trazabilidad operativa.
