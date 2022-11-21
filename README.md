# Image Moderation Service

---

## Run Project

To start the project locally on your machine:

1. Install [Docker](https://www.docker.com/)
2. Clone the project
3. Run `docker-compose up` at the root of the project
4. Open [localhost:3000](http://localhost:3000/)

Docker compose command will start three containers, each running one main part of the project:

- **PostgreSQL database** (on port 5432)
- **Golang backend** (on port 8080)
- **React frontend** (on port 3000)

---

## Main Features

- The backend exposes an API that allows to create, update and get info about the reports. It allows also to get info about the evaluation of each report.

- When one report is created, the uploaded image is stored in the container running the backend and a new report entry is saved in the database, with the path to the image, the user_id and the endpoint that should be notified when the image is moderated

- After report creation, the stored image is evaluated using [Sightengine](https://sightengine.com/), an image moderation API. This tool was chosen due to its simple usage, wide range of models to filter content, allowing to send image data in bytes (not only the url) and having a free-tier. The used models were: nudity, wad (weapons, alcohol, drugs), offensive and gore.

- The frontend part consists in a backoffice with a landing page and three main pages:

  - `/reports/` allows to see the reports that are not moderated. They appear sorted by decreasing probability of containing sensitive content, with the ones that were not evaluated at that moment appearing at the bottom. It allows also to see the details of the report's evaluation, and to approve/reject the report.

  - `/archive/` allows to see the reports that are already moderated. They appear sorted by the date and time they were moderated.

  - `/new/` has a form that allows to create new reports.

- When one report is moderated, the backend will make a post request with `{"approved": true | false}` to the provided callback endpoint.

- The React app is responsive, to handle different screen sizes

---

## API

### Get non moderated reports

```
GET  http://localhost:8080/report/
```

### Create report

```
POST  http://localhost:8080/report/
```

```
form-data:

user_id: string
callback_url: string
image: file (.jpg or .png) || image_url: string
```

### Get moderated reports

```
GET  http://localhost:8080/report/answered/
```

### Moderate report

```
PUT  http://localhost:8080/report/:report_id/answer
```

```
{
    "approved": bool
}
```

### Get report's evaluation details

```
GET  http://localhost:8080/evaluation/:report_id/
```

### Extra endpoint to test the notification of the callback endpoint (just prints to the console when notified)

```
POST  http://localhost:8080/callback/
```

```
{
    "approved": bool
}
```

---

## Project Structure

The project has the following directory structure:

### BACKEND:

- `config`:

  - connect to the database and load environment variables

- `controllers`:

  - handlers for the API endpoints

- `migrate`:

  - apply migrations to the database

- `models`:

  - create the models Reports and Evaluations based on structs (using GORM), database queries and main functions related with models

- `routes`:

  - add API endpoints

- `utils`:
  - auxiliar functions

`main.go` automigrates on start, checks for non evaluated reports and starts the webserver (using Gin)
`Dockerfile` creates the image to run the backend

### FRONTEND (SRC):

- `app`:

  - define the API routes

- `components`:

  - create components that are reused throughout the app

- `pages`:

  - create the four pages of the app: **Home**, **Reports**, **Archive** and **New Report**

- `redux`:
  - contains all the logic related with the app state management
  - this React app uses Redux with Redux-Toolkit, structured by slices (each slice generates all the reducers, actions and handle async logic)

In `App.js`, the React app routes are defined, defining the app's pages and their paths

### ROOT:

- `docker-compose.yml` to run the docker containers
- `.env` with environment variables

---

## Future Work / Possible Improvements

- Choosing a better image moderator. Although the tool that was used presented some good results, especially when detecting nudity, it lacked some sensibility to detect other content, like violence;

- Implement WebSockets communication between the server and client, to notify all the connected clients when a new report is created, evaluated or moderated (archived) and update the client accordingly (so that one user don't moderate a report that has just been moderated);

- Uploading the images to the cloud, to handle the increasing usage of local memory;

- Implement user authentication, with JWT, so that users could login and upload their images while authenticated;

- Implement pagination in some GET requests, to better handle the increasing load in the communication, allowing the service to scale (for example, don't retrieve all the archived reports in one single GET).

- Better design, with more animations and a better user experience.
