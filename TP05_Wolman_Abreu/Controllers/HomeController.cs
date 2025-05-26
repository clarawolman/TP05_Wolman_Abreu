using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;

namespace EscapeRoom.Controllers
{
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

        public IActionResult Ingreso()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Ingreso(string nombre)
        {
            if (!string.IsNullOrWhiteSpace(nombre))
            {
                HttpContext.Session.SetString("Nombre", nombre);
                HttpContext.Session.SetInt32("SalaActual", 1);
                HttpContext.Session.SetString("TimerInicio", DateTime.Now.ToString());
                return RedirectToAction("Sala1");
            }
            ViewBag.Error = "Por favor, ingresá un nombre.";
            return View();
        }

        public IActionResult Sala1()
        {
            if (!ValidarAcceso(1)) return RedirectToAction("Index");
            ViewBag.Sala = 1;
            ViewBag.TotalSalas = 7;
            return View();
        }

        [HttpPost]
        public IActionResult Sala1(string respuesta)
        {
            if (respuesta == "correcta")
            {
                HttpContext.Session.SetInt32("SalaActual", 2);
                return RedirectToAction("Sala2");
            }
            ViewBag.Mensaje = "Respuesta incorrecta. ¡Intentá de nuevo!";
            ViewBag.Sala = 1;
            ViewBag.TotalSalas = 7;
            return View();
        }

        public IActionResult Sala2()
        {
            if (!ValidarAcceso(2)) return RedirectToAction("Index");
            ViewBag.Sala = 2;
            ViewBag.TotalSalas = 7;
            return View();
        }

        [HttpPost]
        public IActionResult Sala2(string respuesta)
        {
            if (respuesta == "correcta")
            {
                HttpContext.Session.SetInt32("SalaActual", 3);
                return RedirectToAction("Sala3");
            }
            ViewBag.Mensaje = "No aceptado aún.";
            ViewBag.Sala = 2;
            ViewBag.TotalSalas = 7;
            return View();
        }

        public IActionResult Sala3()
        {
            if (!ValidarAcceso(3)) return RedirectToAction("Index");
            ViewBag.Sala = 3;
            ViewBag.TotalSalas = 7;
            return View();
        }

        [HttpPost]
        public IActionResult Sala3(string respuesta)
        {
            if (respuesta == "correcta")
            {
                HttpContext.Session.SetInt32("SalaActual", 4);
                return RedirectToAction("Sala4");
            }
            ViewBag.Mensaje = "Respuesta incorrecta. Baldosa ruidosa.";
            ViewBag.Sala = 3;
            ViewBag.TotalSalas = 7;
            return View();
        }

        public IActionResult Sala4()
        {
            if (!ValidarAcceso(4)) return RedirectToAction("Index");
            ViewBag.Sala = 4;
            ViewBag.TotalSalas = 7;
            return View();
        }

        [HttpPost]
        public IActionResult Sala4(string respuesta)
        {
            if (respuesta == "correcta")
            {
                HttpContext.Session.SetInt32("SalaActual", 5);
                return RedirectToAction("Sala5");
            }
            ViewBag.Mensaje = "Combinación incorrecta.";
            ViewBag.Sala = 4;
            ViewBag.TotalSalas = 7;
            return View();
        }

        public IActionResult Sala5()
        {
            if (!ValidarAcceso(5)) return RedirectToAction("Index");
            ViewBag.Sala = 5;
            ViewBag.TotalSalas = 7;
            return View();
        }

        [HttpPost]
        public IActionResult Sala5(string respuesta)
        {
            if (respuesta?.ToLower() == "wingardium leviosa")
            {
                HttpContext.Session.SetInt32("SalaActual", 6);
                return RedirectToAction("Sala6");
            }
            ViewBag.Mensaje = "Respuesta incorrecta.";
            ViewBag.Sala = 5;
            ViewBag.TotalSalas = 7;
            return View();
        }

        public IActionResult Sala6()
        {
            if (!ValidarAcceso(6)) return RedirectToAction("Index");
            ViewBag.Sala = 6;
            ViewBag.TotalSalas = 7;
            return View();
        }

        [HttpPost]
        public IActionResult Sala6(string respuesta)
        {
            if (respuesta == "correcta")
            {
                HttpContext.Session.SetInt32("SalaActual", 7);
                return RedirectToAction("Victoria");
            }
            ViewBag.Mensaje = "Secuencia incorrecta.";
            ViewBag.Sala = 6;
            ViewBag.TotalSalas = 7;
            return View();
        }

        public IActionResult Victoria()
        {
            if (!ValidarAcceso(7)) return RedirectToAction("Index");
            return View();
        }

        private bool ValidarAcceso(int sala)
        {
            int? salaActual = HttpContext.Session.GetInt32("SalaActual");
            return salaActual != null && salaActual >= sala;
        }
    }
}
