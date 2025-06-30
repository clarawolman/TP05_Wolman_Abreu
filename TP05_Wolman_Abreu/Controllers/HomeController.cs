using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Collections.Generic;

namespace EscapeRoom.Controllers
{ /**/
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Integrantes()
        {
            return View();
        }

        public IActionResult InstruccionesJuego()
        {
            return View();
        }
        public IActionResult Ingreso()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Ingreso(string nombre, string casa)
        {
            if (!string.IsNullOrWhiteSpace(nombre) && !string.IsNullOrWhiteSpace(casa))
            {
                HttpContext.Session.SetString("Nombre", nombre);
                HttpContext.Session.SetString("Casa", casa);
                HttpContext.Session.SetInt32("SalaActual", 1);
                HttpContext.Session.SetString("TimerInicio", DateTime.Now.ToString());

                // Redirige a la primera sala según la casa
                return RedirectToAction($"Sala1{casa}");
            }
            ViewBag.Error = "Por favor, ingresá tu nombre y elegí una casa.";
            return View();
        }
        private bool ValidarAcceso(int sala)
        {
            int? salaActual = HttpContext.Session.GetInt32("SalaActual");
            return salaActual != null && salaActual >= sala;
        }

        private void CargarDatosSala(int numero)
        {
            ViewBag.Sala = numero;
            ViewBag.TotalSalas = 7;
        }

        public IActionResult Sala1Gryffindor()
        {
            if (!ValidarAcceso(1)) return RedirectToAction("Index");
            CargarDatosSala(1);
            ViewBag.Casa = HttpContext.Session.GetString("Gryffindor");
            return View("Sala1Gryffindor");
        }

        public IActionResult Sala1Slytherin()
        {
            if (!ValidarAcceso(1)) return RedirectToAction("Index");
            CargarDatosSala(1);
            ViewBag.Casa = HttpContext.Session.GetString("Slytherin");
            return View("Sala1Slytherin");
        }

        public IActionResult Sala1Ravenclaw()
        {
            if (!ValidarAcceso(1)) return RedirectToAction("Index");
            CargarDatosSala(1);
            ViewBag.Casa = HttpContext.Session.GetString("Ravenclaw");
            return View("Sala1Ravenclaw");
        }

        public IActionResult Sala1Hufflepuff()
        {
            if (!ValidarAcceso(1)) return RedirectToAction("Index");
            CargarDatosSala(1);
            ViewBag.Casa = HttpContext.Session.GetString("Hufflepuff");
            return View("Sala1Hufflepuff");
        }
        private static readonly Dictionary<string, string> CardPairs = new Dictionary<string, string>
        {
            { "nombre_hipogrifo.jpg", "imagen_hipogrifo.jpg" },
            { "nombre_thestral.jpg", "imagen_thestral.jpg" },
            { "nombre_basilisco.jpg", "imagen_basilisco.jpg" }
        };

        private static readonly List<string> AllCards = new List<string>();

        static HomeController()
        {
            // Inicializar AllCards con todos los nombres e imágenes
            foreach (var pair in CardPairs)
            {
                AllCards.Add(pair.Key);   // Carta con nombre
                AllCards.Add(pair.Value); // Carta con imagen
            }
        }

        private bool SonPareja(string carta1, string carta2)
        {
            return (CardPairs.ContainsKey(carta1) && CardPairs[carta1] == carta2) ||
                   (CardPairs.ContainsKey(carta2) && CardPairs[carta2] == carta1);
        }

        public IActionResult SalaMemotest()
        {
            if (!ValidarAcceso(1)) return RedirectToAction("Index");

            if (HttpContext.Session.GetString("CartasMezcladas") == null)
            {
                var mezcladas = AllCards.OrderBy(_ => Guid.NewGuid()).ToList();
                HttpContext.Session.SetString("CartasMezcladas", string.Join(",", mezcladas));
                HttpContext.Session.SetString("Volteadas", "");
                HttpContext.Session.SetString("Encontradas", "");
                HttpContext.Session.SetInt32("UltimaCarta", -1);
            }

            var encontradas = HttpContext.Session.GetString("Encontradas")?.Split(',', StringSplitOptions.RemoveEmptyEntries).Length ?? 0;
            if (encontradas == AllCards.Count)
            {
                HttpContext.Session.SetInt32("SalaActual", 2);
                return RedirectToAction("Sala2");
            }

            return View();
        }

        [HttpPost]
        public IActionResult TocarCarta(int index)
        {
            var cartas = HttpContext.Session.GetString("CartasMezcladas").Split(',').ToList();
            var volteadas = HttpContext.Session.GetString("Volteadas")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToList();
            var encontradas = HttpContext.Session.GetString("Encontradas")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .ToList();
            var ultima = HttpContext.Session.GetInt32("UltimaCarta") ?? -1;

            // Si la carta ya está encontrada, no hacer nada
            if (encontradas.Contains(index))
                return RedirectToAction("SalaMemotest");

            // Limpiar cartas volteadas anteriores que no coincidieron
            if (volteadas.Count == 2)
            {
                volteadas.Clear();
            }

            // Si la carta ya está volteada en este turno, no hacer nada
            if (volteadas.Contains(index))
                return RedirectToAction("SalaMemotest");

            volteadas.Add(index);

            if (ultima == -1)
            {
                HttpContext.Session.SetInt32("UltimaCarta", index);
            }
            else
            {
                if (SonPareja(cartas[ultima], cartas[index]))
                {
                    encontradas.Add(ultima);
                    encontradas.Add(index);
                    volteadas.Clear();

                    // Verificar si el juego está completo
                    if (encontradas.Count == AllCards.Count)
                    {
                        HttpContext.Session.SetInt32("SalaActual", 2);
                    }
                }
                HttpContext.Session.SetInt32("UltimaCarta", -1);
            }

            HttpContext.Session.SetString("Volteadas", string.Join(",", volteadas));
            HttpContext.Session.SetString("Encontradas", string.Join(",", encontradas));

            return RedirectToAction("SalaMemotest");
        }

        public IActionResult Sala2()
        {
            if (!ValidarAcceso(2)) return RedirectToAction("Index");
            CargarDatosSala(2);
            return View("Sala2Caliz");
        }

        [HttpPost]
public IActionResult Sala2Pociones()
{
    if (!ValidarAcceso(2)) return RedirectToAction("Index");
    return View("Sala2Pociones");
}

        [HttpPost]
        public IActionResult TirarNombreAlCaliz()
        {
            // El jugador "tiró" su nombre. Vamos a la escena de las pociones
            return View("Sala2Pociones");
        }

        [HttpPost]
        public IActionResult ResolverPociones(string pocion)
        {
            if (!ValidarAcceso(2)) return RedirectToAction("Index");

            if (pocion == "correcta")
            {
                HttpContext.Session.SetInt32("SalaActual", 3);
                return View("Sala2Final");
            }
            else
            {
                ViewBag.Mensaje = "¡Esa poción es peligrosa! Intenta con otra.";
                return View("Sala2Pociones");
            }
        }

        [HttpPost]
        public IActionResult Sala2(string respuesta)
        {
            if (respuesta == "correcta")
            {
                HttpContext.Session.SetInt32("SalaActual", 3);
                return RedirectToAction("Sala3");
            }
            return RedirectToAction("Sala2");
        }

        public IActionResult Sala3()
        {
            if (!ValidarAcceso(3)) return RedirectToAction("Index");
            CargarDatosSala(3);
            return View();
        }

        [HttpPost]
        public IActionResult CompletarBuscaminas()
        {
            if (!ValidarAcceso(3)) return RedirectToAction("Index");
            HttpContext.Session.SetInt32("SalaActual", 4);
            return RedirectToAction("Sala4");
        }

        public IActionResult Sala4()
        {
            if (!ValidarAcceso(4)) return RedirectToAction("Index");
            CargarDatosSala(4);
            return View();
        }

        public IActionResult Ganaste()
        {
            return View();
        }

        public IActionResult tiempoTerminado()
        {
            return View();
        }
    }
}