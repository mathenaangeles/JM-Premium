# eCommerce Template

This is a generic eCommerce template with a **React** client, a **Flask** server, and an **SQLite** database.

### Prerequisites
- [Python 3.9+](https://www.python.org/downloads/)
- [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Getting Started
#### Docker
- To build and start the container, run `docker-compose up --build`.
- To start the container without rebuilding the image, run `docker-compose up -d`.
- To stop and remove the container, run `docker-compose down`. Do this when you want a clean rebuild, especially after the dependencies or Dockerfile changes.

#### Server and Client
1. Create a virtual environment by running `python -m venv .venv`. 
2. Activate the virtual environment by running `source .venv/bin/activate/`.
3. Navigate to the `server` directory and run `pip install -r requirements.txt`.
4. Create a `.env` file in the `server` directory. Add the following:
```
SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://postgres:z|4*h/icM5c3.=x3@104.199.170.198/jm_premium_database'
SQLALCHEMY_TRACK_MODIFICATIONS = 0
SQLALCHEMY_ECHO = 0
FLASK_DEBUG = 1
FLASK_ENV = 'development'
JWT_SECRET_KEY = '6l@<gm4zL2#@'
JWT_COOKIE_SECURE = 0
JWT_ACCESS_COOKIE_NAME = 'access_token_cookie'
JWT_REFRESH_COOKIE_NAME = 'refresh_token_cookie'
JWT_COOKIE_CSRF_PROTECT = 1  
GCS_BUCKET_NAME = 'jm-premium'
XENDIT_API_KEY = 'xnd_development_oYeRrHeXo9gsmwTK9c7cYF2qkYlk8u1NdsKaWQeHDWCPYjFdcYzcqexfba9V7Ue'
XENDIT_BASE_URL= 'https://api.xendit.co'
XENDIT_WEBHOOK_TOKEN = 'zKinZAqGberRZ4TR4CUadfst5Iv2UBcJiJNH9mrCrB88PPBF'
NINJAVAN_BASE_URL= 'https://api-sandbox.ninjavan.co/ph'
NINJAVAN_CLIENT_ID=''
NINJAVAN_CLIENT_SECRET=''
NINJAVAN_WEBHOOK_SECRET=''
DB_CONNECTION_NAME='jm-premium:asia-east1:jm-premium-db'
```
5. In the `server` directory, run `flask run`.
6. Navigate to the `client` directory and run `npm install`.
7. In the `client` directory, run `npm start`.

### PostgreSQL 
- **User**: `postgres`
- **Instance ID**: `jm-premium-db`
- **Password**: `z|4*h/icM5c3.=x3`
- **Region**: `asia-east1` (Taiwan)
#### Database
- For local development, add your IP address under Connections of the Cloud SQL instance.
- If this is your first time setting up migrations, you need to initialize the migration directory by running `flask db init`.
- Every time you modify your SQLAlchemy models, generate a migration file by running `flask db migrate -m " <INSERT DESCRIPTION OF CHANGES HERE>"`.
- To apply the migrations to the database, run `flask db upgrade`.
- To undo the last migration, run `flask db downgrade`.
- To edit `app.db` use the sqlite3 CLI by running `sqlite3 server/instance/app.db`.

### Deployment
A GitHub Actions workflow is triggered upon pushing to `main`.

- To test the client, run the following in the client directory:
```
# Build the image
docker build -t test-client -f Dockerfile.prod .

# Run it locally
docker run -d -p 8080:80 --name test-client test-client

# Check if it is running
docker ps

# Check logs
docker logs test-client

# Test the endpoint
curl http://localhost:8080
curl http://localhost:8080/health

# Clean up
docker stop test-client
docker rm test-client
```

- To test the client, run the following in the server directory:
```
# Build the image
docker build -t test-server -f Dockerfile.prod .

# Run it locally
docker run -p 8080:8080 -e PORT=8080 test-server

# Check if it is running
docker ps

# Check logs
docker logs test-server

# Test the endpoint
curl http://localhost:8080/

# Clean up
docker stop test-server
docker rm test-server
```
