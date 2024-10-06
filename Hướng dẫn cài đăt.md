# Not using Docker

Requirement: having python and npm or docker

## Backend:

From root folder, run following command:

Linux:

```
cd bookstore
pip install -r requirements.txt
python manage.py runserver
```

Window:

```
cd bookstore
py -m pip install -r requirements.txt
py manage.py runserver
```

## Frontend:

From root folder, run following command:

```
cd Frontend
npm install
npm start
```

# Using Docker

From root folder, run following command:

```
docker compose up -d
```

Waiting for building containers

# Test

open "http:localhost:4200" in the browser
account:

- admin: thanhlam02412002@gmail.com / 123456
- client: thanhlam0241@gmail.com / 123456
