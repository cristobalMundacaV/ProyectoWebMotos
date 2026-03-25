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
            "Iluminacion LED",
            "Instrumentacion TFT a color",
            "Sistema de frenos Brembo y Nissin",
            "Sistema de control de traccion",
            "Sistema Quick Shift",
            "Toma USB",
            "Dos modos de conduccion",
            "Computadora de viaje",
            "Launch control",
            "Accionamiento valvula de salida de escape",
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
