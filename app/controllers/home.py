"""Controlador: raíz del sitio. Sirve la landing page de presentación."""
from __future__ import annotations

from flask import Blueprint, render_template, url_for

from app.models.apps import default_app, get_app
from app.models.watchlists import get_watchlist

bp = Blueprint("home", __name__)


@bp.get("/")
def index():
    return render_template(
        "landing.html",
        default_app=default_app(),
        quiz_outcomes=_quiz_outcomes(),
    )


def _quiz_outcomes() -> dict:
    """Construye las recomendaciones del cuestionario interactivo.

    Cada clave es un resultado posible del árbol de preguntas (ver
    ``quiz.js``) y apunta a una watchlist o app concreta del sidebar.
    """
    overview = get_watchlist("overview")
    consumer = get_watchlist("consumer-electronics")
    gaming = get_watchlist("gaming-multimedia")
    varianza = get_app("analisis-varianza")

    return {
        "market": {
            "icon": overview.icon,
            "title": f"Watchlist: {overview.name}",
            "description": (
                "Te interesa el panorama general: índices, cripto y divisas, "
                "todo en un solo vistazo."
            ),
            "url": url_for("graficas.show_watchlist", slug=overview.slug),
        },
        "tech": {
            "icon": consumer.icon,
            "title": f"Watchlist: {consumer.name}",
            "description": (
                "Te interesan las grandes tecnológicas y fabricantes de "
                "electrónica de consumo."
            ),
            "url": url_for("graficas.show_watchlist", slug=consumer.slug),
        },
        "gaming": {
            "icon": gaming.icon,
            "title": f"Watchlist: {gaming.name}",
            "description": (
                "Te interesan los videojuegos y el entretenimiento digital."
            ),
            "url": url_for("graficas.show_watchlist", slug=gaming.slug),
        },
        "risk": {
            "icon": varianza.icon,
            "title": varianza.name,
            "description": (
                "Antes de seguir un activo quieres entender qué tan "
                "arriesgado (volátil) es."
            ),
            "url": url_for(varianza.endpoint),
        },
    }
