from django.utils.text import slugify
import unicodedata

from .models import TipoAtributo, ValorAtributoMoto


FICHA_TECNICA_TEMPLATES = [
    {
        "seccion": "MOTOR",
        "orden": 1,
        "items": [
            "Tipo",
            "Refrigeracion",
            "Alimentacion",
            "Diametro x carrera",
            "Cilindrada",
            "Relacion de compresion",
            "Potencia Maxima",
            "Par maximo",
            "Embrague",
            "Cambio",
            "Consumo homologado",
            "Bateria",
        ],
    },
    {
        "seccion": "CARACTERISTICAS",
        "orden": 2,
        "items": [
            "Chasis",
            "Suspension delantera",
            "Suspension trasera",
            "Neumatico delantero",
            "Neumatico trasero",
            "Freno delantero",
            "Freno trasero",
            "ABS",
        ],
    },
    {
        "seccion": "DIMENSIONES Y CAPACIDADES",
        "orden": 3,
        "items": [
            "Largo",
            "Ancho",
            "Alto",
            "Distancia entre ejes",
            "Distancia al suelo",
            "Altura asiento",
            "Peso neto",
            "Capacidad deposito",
            "Velocidad maxima",
        ],
    },
    {
        "seccion": "EQUIPAMIENTO",
        "orden": 4,
        "items": [
            "Display 100% digital",
            "Cuentakilometros total y parcial",
            "Parabrisas regulable en altura",
            "Medidor de combustible",
            "Reloj",
            "Indicador de averia de Inyeccion",
            "Indicador de averia del ABS Bosch",
            "Indicador de marcha engranada",
            "Pantalla TFT",
            "Indicador de temperatura alta de motor",
            "Sensor de presion neumaticos",
            "Iluminacion Full LED",
            "Arranque sin llave",
            "Control crucero",
            "Cubre Punos",
            "Bluetooth",
            "Conectividad Bluetooth y Navegacion",
            "Luces de emergencia (Hazard)",
            "Calefaccion en asiento",
            "Calefaccion en punos",
            "Toma 12V, USB y USB-C",
            "Camara frontal",
            "TCS Desconectable",
            "Parrilla trasera",
            "Neblineros integrados",
            "Defensas laterales",
            "Juego de herramientas",
            "Faros Auxiliares",
            "Interruptor de caballete lateral",
            "Radar",
            "Anti Shimmy",
            "Sistema Quick Shift",
            "Frenos",
        ],
    },
]


def ensure_moto_ficha_defaults(moto):
    def normalize_item_name(value):
        text = str(value or "").strip()
        if not text:
            return ""
        normalized = unicodedata.normalize("NFD", text)
        without_accents = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
        return without_accents.casefold()

    # 1) Base minima por plantilla (compatibilidad historica).
    for template in FICHA_TECNICA_TEMPLATES:
        seccion_slug = slugify(template["seccion"]) or f"seccion-{template['orden']}"
        tipo, _ = TipoAtributo.objects.get_or_create(
            slug=seccion_slug,
            defaults={
                "nombre": template["seccion"],
                "orden": template["orden"],
                "activo": True,
            },
        )
        if tipo.nombre != template["seccion"] or tipo.orden != template["orden"] or not tipo.activo:
            tipo.nombre = template["seccion"]
            tipo.orden = template["orden"]
            tipo.activo = True
            tipo.save(update_fields=["nombre", "orden", "activo"])

        for index, item_nombre in enumerate(template["items"], start=1):
            ValorAtributoMoto.objects.get_or_create(
                moto=moto,
                tipo_atributo=tipo,
                nombre=item_nombre,
                defaults={
                    "valor": "",
                    "orden": index,
                },
            )

    # 2) Sincroniza catalogo global de items (creados en otras motos) para
    #    que una moto nueva herede todo lo ya existente por seccion.
    existing_rows = ValorAtributoMoto.objects.filter(moto=moto).values_list(
        "tipo_atributo_id",
        "nombre",
    )
    existing_keys = {
        (tipo_id, normalize_item_name(nombre))
        for tipo_id, nombre in existing_rows
        if normalize_item_name(nombre)
    }

    global_rows = (
        ValorAtributoMoto.objects.select_related("tipo_atributo")
        .order_by("tipo_atributo__orden", "tipo_atributo_id", "orden", "id")
        .values(
            "tipo_atributo_id",
            "tipo_atributo__slug",
            "tipo_atributo__nombre",
            "tipo_atributo__orden",
            "nombre",
            "valor",
            "orden",
        )
    )

    seen_global_keys = set()
    for row in global_rows:
        item_key = normalize_item_name(row["nombre"])
        if not item_key:
            continue

        tipo_id = row["tipo_atributo_id"]
        key = (tipo_id, item_key)
        if key in seen_global_keys:
            continue
        seen_global_keys.add(key)

        tipo, _ = TipoAtributo.objects.get_or_create(
            id=tipo_id,
            defaults={
                "slug": row["tipo_atributo__slug"] or f"seccion-{tipo_id}",
                "nombre": row["tipo_atributo__nombre"] or f"SECCION {tipo_id}",
                "orden": row["tipo_atributo__orden"] or 1,
                "activo": True,
            },
        )
        if not tipo.activo:
            tipo.activo = True
            tipo.save(update_fields=["activo"])

        if key in existing_keys:
            continue

        ValorAtributoMoto.objects.create(
            moto=moto,
            tipo_atributo=tipo,
            nombre=row["nombre"],
            valor=row["valor"] or "",
            orden=row["orden"] or 1,
        )
        existing_keys.add(key)
