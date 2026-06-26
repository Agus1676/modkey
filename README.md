# ⌨️ ModKey | E-Commerce Premium de Teclados Mecánicos Custom

¡Bienvenido a **ModKey**! Una plataforma de comercio electrónico de alta fidelidad dedicada a la venta de teclados mecánicos premium, switches lubricados, keycaps de diseño y accesorios custom. El proyecto está construido utilizando **Next.js (App Router)**, **TypeScript**, y **Tailwind CSS**, priorizando una estética retro-futurista oscura con iluminaciones neón y micro-interacciones pulidas.

---

## 🌟 Características Destacadas

### 🔊 1. Probador de Acústica de Switches (Sound Tester)
*   **Web Audio API:** Generación y síntesis matemática de frecuencias de audio directamente en el navegador (sin archivos `.mp3` pesados externos) para recrear los perfiles de sonido de tipeo más buscados:
    *   *Linear (Thock):* Tono grave, profundo y amortiguado.
    *   *Tactile (Clack):* Tono medio y nítido.
    *   *Clicky (Snap):* Tono metálico y agudo.
*   **Teclado 60% Reactivo:** Un render de teclado en CSS responsivo que se ilumina con luces neón y reacciona en tiempo real a las teclas presionadas en el teclado físico de la computadora.
*   **Visualizador de Frecuencia:** Un osciloscopio en tiempo real dibujado sobre `<canvas>` que reacciona a los picos de volumen de cada tecla pulsada.

### 🎡 2. Rueda de Descuentos Neón (Lucky Wheel)
*   **Gamificación Interactiva:** Una rueda de la fortuna flotante con luces neón y giros simulados mediante inercia física real (`requestAnimationFrame`).
*   **Sonidos en Tiempo Real:** Emisión de clics acústicos síncronos al cruzar los pines de cada segmento y una melodía arpegiada victoriosa al detenerse.
*   **Cupones Reales:** Los usuarios pueden ganar códigos como `THOCK15`, `CYBER25`, `FREESHIP` o `KEYCAP20`, los cuales se guardan en `localStorage` y se aplican de forma automática en la pasarela de pago.

### 🔒 3. Portal de Administración Seguro (Admin Gate)
*   **Acceso Protegido:** Un login gate moderno y seguro que restringe el acceso a las vistas de métricas, inventario y órdenes.
*   **Animaciones Premium:** Formulario con botones de visualización de contraseña, control de sesión persistente (`localStorage`) o temporal (`sessionStorage`), y una animación de sacudida (shake) carmesí neón ante contraseñas incorrectas.
*   **Panel CRUD:** Dashboard completo para gestionar productos, actualizar stocks en tiempo real y realizar seguimiento de los pedidos recibidos.

### 🧾 4. Checkout con Ticket de Barcode Neón
*   **Recálculo de Costos en ARS:** Configurado para pesos argentinos. Envío express a `$4.500` ARS, o **Gratis** si el subtotal de productos supera los `$150.000` ARS.
*   **Desglose Detallado:** Muestra descuentos dinámicos y deducciones en tiempo real según el cupón aplicado.
*   **Ticket Estilo Físico:** Al confirmar la compra, genera un recibo digital translúcido con un código de barras responsivo dibujado en CSS puro.

### 📸 5. Galería de Inspiraciones Interactiva
*   Modal animado que presenta setups de escritorio premium en alta resolución. Al hacer clic en *"Ver Teclado"* de cualquier estilo, el modal se cierra, realiza un scroll suave al catálogo y pre-filtra los teclados correspondientes para incentivar la compra.

### 💬 6. Botón de Soporte por WhatsApp
*   Botón flotante con el color de marca oficial de WhatsApp y efecto de ondas expansivas que abre una conversación pre-redactada de asesoramiento personalizado con un clic.

---

## 🛠️ Stack Tecnológico

*   **Framework:** Next.js 16 (App Router) y React 19.
*   **Lenguaje:** TypeScript.
*   **Estilos:** Tailwind CSS v4 con variables neón personalizadas.
*   **Animaciones:** Framer Motion (para transiciones de páginas y modales).
*   **Iconografía:** Lucide React.
*   **Base de Datos / Backend:** Supabase (con fallback automático e inteligente a `localStorage` para asegurar funcionamiento inmediato sin configuración de red).

---

## 🚀 Instalación y Desarrollo Local

Seguí estos pasos para clonar y ejecutar el proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Agus1676/modkey.git
    cd modkey
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

4.  **Abrir el navegador:**
    Ingresá a [http://localhost:3000](http://localhost:3000) para ver tu tienda en vivo.

---

## ✍️ Créditos y Autoría

Este sitio web y todas sus características interactivas han sido desarrollados por **Agustin Pollan**. 

*   **Contacto:** agustinpollanceo@gmail.com
*   **GitHub:** [@Agus1676](https://github.com/Agus1676)
