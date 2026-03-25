from django.utils.text import slugify

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
