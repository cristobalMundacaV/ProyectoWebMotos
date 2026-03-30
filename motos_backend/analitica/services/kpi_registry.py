from dataclasses import dataclass


class KPIType:
    OPERATIVE = "OPERATIVE"
    PERFORMANCE = "PERFORMANCE"
    TREND = "TREND"


class KPITimeMode:
    REALTIME = "REALTIME"
    PERIOD = "PERIOD"
    ROLLING = "ROLLING"
    FIXED_WINDOW = "FIXED_WINDOW"


@dataclass(frozen=True)
class KPIDefinition:
    kpi_key: str
    nombre: str
    tipo: str
    time_mode: str
    default_window_days: int
    use_global_period: bool
    allowed_granularity: tuple[str, ...]
    min_sample_size: int
    fallback_policy: str
    empty_state_rule: str
    comparison_rule: str
    business_decision: str


KPI_REGISTRY: dict[str, KPIDefinition] = {
    "mantenciones_agendadas": KPIDefinition(
        kpi_key="mantenciones_agendadas",
        nombre="Mantenciones agendadas",
        tipo=KPIType.PERFORMANCE,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=1,
        fallback_policy="empty_with_reason",
        empty_state_rule="return_zero_with_period_context",
        comparison_rule="previous_equivalent_period",
        business_decision="medir demanda efectiva del periodo",
    ),
    "crecimiento_vs_periodo_anterior": KPIDefinition(
        kpi_key="crecimiento_vs_periodo_anterior",
        nombre="Crecimiento vs periodo anterior",
        tipo=KPIType.TREND,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=3,
        fallback_policy="mark_low_sample_no_percentage",
        empty_state_rule="return_empty_when_no_current_period_data",
        comparison_rule="previous_equivalent_period_or_new_active_period",
        business_decision="detectar aceleracion o caida de demanda",
    ),
    "ocupacion_taller": KPIDefinition(
        kpi_key="ocupacion_taller",
        nombre="Ocupacion del taller",
        tipo=KPIType.OPERATIVE,
        time_mode=KPITimeMode.REALTIME,
        default_window_days=14,
        use_global_period=False,
        allowed_granularity=("day",),
        min_sample_size=1,
        fallback_policy="empty_with_reason",
        empty_state_rule="requires_active_schedule_capacity",
        comparison_rule="none",
        business_decision="gestionar capacidad operativa disponible",
    ),
    "modelo_mas_visto": KPIDefinition(
        kpi_key="modelo_mas_visto",
        nombre="Modelo mas visto",
        tipo=KPIType.PERFORMANCE,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=5,
        fallback_policy="fallback_rolling_30d",
        empty_state_rule="return_no_data_label",
        comparison_rule="none",
        business_decision="priorizar foco comercial del catalogo",
    ),
    "top_5_modelos": KPIDefinition(
        kpi_key="top_5_modelos",
        nombre="Top 5 modelos de moto",
        tipo=KPIType.PERFORMANCE,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=10,
        fallback_policy="fallback_rolling_30d",
        empty_state_rule="return_empty_rank",
        comparison_rule="none",
        business_decision="ordenar demanda por modelo",
    ),
    "categorias_mas_vistas": KPIDefinition(
        kpi_key="categorias_mas_vistas",
        nombre="Categorias mas vistas",
        tipo=KPIType.PERFORMANCE,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=10,
        fallback_policy="fallback_rolling_30d",
        empty_state_rule="return_empty_rank",
        comparison_rule="previous_equivalent_period",
        business_decision="ajustar mix de catalogo",
    ),
    "tendencia_visitas": KPIDefinition(
        kpi_key="tendencia_visitas",
        nombre="Tendencia de visitas",
        tipo=KPIType.TREND,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("hour", "day", "week", "month"),
        min_sample_size=5,
        fallback_policy="fallback_rolling_30d",
        empty_state_rule="return_empty_series",
        comparison_rule="point_vs_previous_point",
        business_decision="detectar estacionalidad y efecto de campañas",
    ),
    "horas_peak": KPIDefinition(
        kpi_key="horas_peak",
        nombre="Horas peak del taller",
        tipo=KPIType.OPERATIVE,
        time_mode=KPITimeMode.ROLLING,
        default_window_days=30,
        use_global_period=False,
        allowed_granularity=("hour",),
        min_sample_size=5,
        fallback_policy="fallback_rolling_90d",
        empty_state_rule="return_empty_rank",
        comparison_rule="none",
        business_decision="dimensionar turnos y carga horaria",
    ),
    "tipo_servicio_mas_solicitado": KPIDefinition(
        kpi_key="tipo_servicio_mas_solicitado",
        nombre="Tipo de servicio mas solicitado",
        tipo=KPIType.PERFORMANCE,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=5,
        fallback_policy="fallback_rolling_30d",
        empty_state_rule="return_empty_rank",
        comparison_rule="none",
        business_decision="priorizar especializacion y capacidad operativa",
    ),
    "tasa_cancelaciones": KPIDefinition(
        kpi_key="tasa_cancelaciones",
        nombre="Tasa de cancelaciones",
        tipo=KPIType.TREND,
        time_mode=KPITimeMode.ROLLING,
        default_window_days=90,
        use_global_period=False,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=20,
        fallback_policy="expand_window_to_180d",
        empty_state_rule="return_insufficient_sample",
        comparison_rule="rolling_baseline",
        business_decision="controlar calidad de confirmacion y desercion",
    ),
    "tasa_no_show": KPIDefinition(
        kpi_key="tasa_no_show",
        nombre="Tasa de no asistencia",
        tipo=KPIType.TREND,
        time_mode=KPITimeMode.ROLLING,
        default_window_days=90,
        use_global_period=False,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=20,
        fallback_policy="expand_window_to_180d",
        empty_state_rule="return_insufficient_sample",
        comparison_rule="rolling_baseline",
        business_decision="reducir no asistencia con recordatorios y politicas",
    ),
    "clientes_nuevos": KPIDefinition(
        kpi_key="clientes_nuevos",
        nombre="Clientes nuevos",
        tipo=KPIType.PERFORMANCE,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=1,
        fallback_policy="empty_with_reason",
        empty_state_rule="return_zero_with_period_context",
        comparison_rule="none",
        business_decision="medir captacion de clientes",
    ),
    "clientes_recurrentes": KPIDefinition(
        kpi_key="clientes_recurrentes",
        nombre="Clientes recurrentes",
        tipo=KPIType.PERFORMANCE,
        time_mode=KPITimeMode.PERIOD,
        default_window_days=30,
        use_global_period=True,
        allowed_granularity=("day", "week", "month"),
        min_sample_size=1,
        fallback_policy="empty_with_reason",
        empty_state_rule="return_zero_with_period_context",
        comparison_rule="none",
        business_decision="medir retencion de clientes",
    ),
    "crecimiento_mensual_reservas": KPIDefinition(
        kpi_key="crecimiento_mensual_reservas",
        nombre="Crecimiento mensual de reservas",
        tipo=KPIType.TREND,
        time_mode=KPITimeMode.FIXED_WINDOW,
        default_window_days=365,
        use_global_period=False,
        allowed_granularity=("month",),
        min_sample_size=3,
        fallback_policy="empty_with_reason",
        empty_state_rule="return_empty_series",
        comparison_rule="month_over_month",
        business_decision="leer tendencia estructural de demanda",
    ),
}

