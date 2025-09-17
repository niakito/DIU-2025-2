# Prototipo del proyecto

Trabajando con Lovable.

Link de colaboración como editor: [Lovable](https://lovable.dev/projects/172b54f6-a1ca-4d6d-97fa-b6338eb72029?magic_link=mc_463dd7b2-fc07-470f-9baf-37b22090e989)

## 1.0.0
_17/09/2025_

Detalle de las funcionalidades que incluye y su estructura actual. 


Comentario:

_Funcionalidad de reservas. Se puede seleccionar un dia y se puede eliminar la reserva de forma individual o grupal. Falta implementar la modificación de menús y la opción de reservar varios almuerzos en un solo flujo._ 

Mi idea, y lo que pedí en mi último prompt, es que al apretar el más se de la indicación de seleccionar los dias en el calendario, de allí se pueden seleccionar varios dias, se mostraría la pantalla de elegir menú para todos los días seleccionados y despues se podria confirmar la reserva. Me quedé sin creditos así que mañana lo pidooo.

### Funcionalidades

+ Sistema de reservas con menús normal o hipocalórico y regla de 48 horas
+ Calendario interactivo con vista mensual y reservas visibles
+ Calendario mensual interactivo para ver y reservar menús
+ Historial completo con opciones de edición y eliminación
+ Perfil de usuario
+ Configuración y autorrellenado de las preferencias predeterminadas del usuario

<br> 

**Pendiente**:

+ Selección múltiple para gestionar varias reservas
+ Edición de reservas

### Interfaz 

La interfaz consiste de los siguientes elementos:

- **Barra superior**: En la esquina derecha se encuentra el ícono del perfil del usuario; presionandolo se puede visualizar su perfil y realizar la configuración de preferencia predeterminada. En la esquina izquierda está el logo del casino para volver a la página principal. y la barra de navegación permite acceder a las funciones principales de la aplicación.

+ **Página principal**: El elemento principal y central corresponde al calendario interactivo, el cual permite ver los dias disponibles para reservar y destaca los en que el usuario tiene una reserva realizada. Si se clickea en un dia, se puede ver los menús de dicha jornada y se da la opción de reservar uno de ellos.
<br> A la derecha hay una barra que contiene el detalle de todas las reservas vigentes; allí se pueden modificar o eliminar. En la parte superior de la barra, se pueda acceder a la funcion de seleccionar varios dias para reserva mediante el ícono más <+>. Bajo la barra hay un historial de reservas realizadas.

