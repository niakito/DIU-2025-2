# Prototipo del proyecto

Trabajando con Lovable. Estaríamos usando este repositorio para mantener registro del versionado y la sincronización en GitHub del [proyecto de Lovable](https://github.com/niakito/casino-uni-planner) solo para lo que es la manipulación del prototipo; cuando este lista la primera versión la movemos aquí.

Link de colaboración como editor: [Lovable](https://lovable.dev/projects/172b54f6-a1ca-4d6d-97fa-b6338eb72029?magic_link=mc_463dd7b2-fc07-470f-9baf-37b22090e989)

** ELIMINAR de la barra de navegación las funciones principales pq es solo una pantalla asiq no sirven**

## 1.0.0
_17/09/2025_

Detalle de las funcionalidades que incluye y su estructura actual. 

### Funcionalidades

+ Sistema de reservas con menús normal o hipocalórico y regla de 48 horas
+ Calendario interactivo con vista mensual y reservas realizadas visibles
+ Calendario para consultar y reservar el menú de un determinado día
+ Selección de múltiples días para realizar varias reservas simultáneamente
+ Historial completo con opciones de edición y cancelación de reservas
+ Edición de reservas
+ Cancelación de una o varias reservas con su confirmación correspondiente
+ Perfil de usuario
+ Configuración y autorrellenado de las preferencias predeterminadas del usuario

### Interfaz 

La interfaz consiste de los siguientes elementos:

- **Barra superior**: En la esquina derecha se encuentra el ícono del perfil del usuario; presionandolo se puede visualizar su perfil y realizar la configuración de preferencia predeterminada. En la esquina izquierda está el logo del casino para volver a la página principal.

+ **Página principal**: El elemento principal y central corresponde al calendario interactivo, el cual permite ver los dias disponibles para reservar y destaca los en que el usuario tiene una reserva realizada. Si se clickea en un dia, se pueden ver los menús de dicha jornada y se da la opción de reservar uno de ellos.
<br> A la derecha hay una barra que contiene el detalle de todas las reservas vigentes; allí se pueden modificar o eliminar individualmente, y apretando sobre una de ellas se pueden seleccionar para la cancelación múltiple. En la parte superior de la barra, se pueda acceder a la funcion de seleccionar varios dias para reserva mediante el ícono más <+>, y se pueden seleccionar todas las reservas para su cancelación mediante el botón <Seleccionar todo>. Bajo la barra hay un historial de reservas realizadas.

