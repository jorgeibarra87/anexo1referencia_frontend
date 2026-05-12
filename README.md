# Front end Para soluciones Hujsp

## Descripcion Camas
Este se encarga mediante un login (user, password de dinamica) dar acceso a diferentes aplicaciones conectado a traves del apigateway en el puerto 8000 (este se remite a cada microservicio).

http://localhost:5173/

# Dependencias con las que ya cuenta el proyecto
- redux
- tailwindcss
- sockjs-client
- react-router-dom
- jwt-decode
- recharts

# Para realizar cambios no se debe modificar el archivo propperties
- evitar hacer commit del arcivo application.properties
- usar el siguiente comando para eviar que se tomen los cambios del archivo application.properties
```bash  
git update-index --assume-unchanged .env
```
- desactivar el comando anterior para tomar los cambios del archivo application.properties
```bash
git update-index --no-assume-unchanged .env
```

# Atener en cuenta
- se conecta a una base de datos postgresql la cual ya debe tener las tablas persona, usuario y roles.
- Se debe configurar el archivo application.properties con los datos de la base de datos.
- Se debe desactivar el eureka client en el archivo application.properties.
- Se debe configurar la opcion para crear-actualizar la base de datos en el archivo application.properties.

# Importante
- Mantener buenas practicas al nombrar las clases y metodos.
- Mantener el codigo limpio y ordenado.
- Mantener la estructura del proyecto.
- Mantener actualizado el README.md con la información del proyecto.

 # Recharts
  Libreria para grficar.