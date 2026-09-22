# Sistema de Reconocimiento Facial

Sistema web para gestionar el acceso seguro a oficinas mediante reconocimiento
facial. La aplicación permite administrar usuarios, roles, oficinas y permisos,
registrar los accesos autorizados o rechazados y consultar indicadores desde un
dashboard.

El proyecto está dividido en dos aplicaciones:

- **Backend:** API REST y lógica de reconocimiento facial.
- **Frontend:** interfaz web para la administración y el punto de control de
	acceso.

## Tecnologías y versiones

### Backend

- Python 3.11 o superior (recomendado: Python 3.11).
- FastAPI 0.136.1.
- Uvicorn 0.47.0.
- SQLAlchemy 2.0.49.
- Alembic 1.18.4.
- PostgreSQL mediante `psycopg2-binary` 2.9.12.
- Pydantic 2.13.4.
- `face-recognition` 1.3.0 y dlib 20.0.1.
- OpenCV 4.13.0.92 y Pillow 12.2.0.
- JWT con `python-jose` 3.5.0.

Las versiones del backend están fijadas en
[`backend/requirements.txt`](backend/requirements.txt).

### Frontend

- Node.js 20.19+ o 22.12+ (requerido por Vite 8).
- React 19.2.6.
- Vite 8.0.12.
- React Router DOM 7.18.0.
- Axios 1.18.1.
- Zustand 5.0.14.
- Recharts 3.10.0.
- ESLint 10.3.0.

Las dependencias del frontend están definidas en
[`frontend/package.json`](frontend/package.json).

## Requisitos previos

1. Python 3.11+ y `pip`.
2. Node.js y npm.
3. PostgreSQL en ejecución.
4. Git.

En Windows, la instalación de `dlib` puede requerir herramientas de compilación
de C++. Si `pip install -r requirements.txt` falla en ese paquete, instala
Visual Studio Build Tools con la carga **Desktop development with C++** y vuelve
a ejecutar la instalación.

## Configuración

Desde la carpeta `backend`, crea un archivo `.env` con valores propios:

```env
DATABASE_URL=postgresql+psycopg2://postgres:tu_password@localhost:5432/face_security
SECRET_KEY=cambia-esta-clave-por-una-larga-y-aleatoria
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=cambia-esta-password
```

Crea previamente la base de datos `face_security` en PostgreSQL. No guardes el
archivo `.env` ni sus secretos en el repositorio.

## Instalación y ejecución

### Backend

En PowerShell:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
alembic upgrade head
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Si PowerShell bloquea la activación del entorno virtual, ejecuta una vez:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

La API estará disponible en `http://localhost:8000` y su documentación
interactiva en `http://localhost:8000/docs`.

### Frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

La interfaz estará disponible en la URL que muestre Vite, normalmente
`http://localhost:5173`.

## Comandos útiles

### Backend

```powershell
# Activar el entorno antes de ejecutar estos comandos
cd backend
alembic current
alembic history
alembic revision --autogenerate -m "descripcion del cambio"
alembic upgrade head
python seed.py
```

### Frontend

```powershell
cd frontend
npm run dev       # Desarrollo con recarga automática
npm run build     # Compilar para producción
npm run preview   # Servir la compilación localmente
npm run lint      # Revisar errores de ESLint
```

## Estructura principal

```text
backend/
	app/
		core/       # Autenticación, seguridad y permisos
		facial/     # Detección y reconocimiento facial
		models/     # Modelos SQLAlchemy
		routes/     # Endpoints de la API
		schemas/    # Esquemas Pydantic
		services/   # Servicios de aplicación
	alembic/      # Migraciones de base de datos
	storage/      # Rostros registrados y capturas de acceso
frontend/
	src/
		api/        # Clientes HTTP
		components/ # Componentes compartidos
		features/   # Módulos de dashboard, usuarios, roles y kiosk
```

## Recomendaciones

- Usa un entorno virtual independiente para el backend y fija las versiones
	instaladas en despliegues reproducibles.
- Cambia `SECRET_KEY`, `INITIAL_ADMIN_PASSWORD` y las credenciales de PostgreSQL
	antes de usar el sistema fuera de desarrollo.
- Restringe `allow_origins` en CORS a los dominios reales del frontend; la
	configuración actual permite todos los orígenes para facilitar el desarrollo.
- Configura copias de seguridad de PostgreSQL y protege las carpetas
	`backend/storage/faces` y `backend/storage/captures`, porque contienen datos
	biométricos e imágenes de acceso.
- Antes de producción, sirve la aplicación detrás de HTTPS, configura un proxy
	inverso y usa un servidor ASGI administrado en lugar de `--reload`.
- Ejecuta `npm run lint`, `npm run build` y las migraciones en una etapa de CI
	antes de desplegar.
- Define políticas de consentimiento, retención y eliminación de datos
	biométricos conforme a la normativa aplicable.
