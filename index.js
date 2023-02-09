const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

// create morgan middleware
app.use(morgan("tiny"));

const API_URL = "/api/persons";

const generateId = () => {
  const random = persons.length > 0 ? Math.floor(Math.random() * 24) : 0;
  return Math.floor((Math.random() + random) * 3);
};

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Persons list</h1>");
});

app.get(API_URL, (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `
    <div>Phonebook has info for ${persons.length} people</div>
    <p>${date}</p>
    `
  );
});

app.get(`${API_URL}/:id`, (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete(`${API_URL}/:id`, (request, response) => {
  const id = Number(request.params.id);

  // create copy of persons array without deleted person
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post(API_URL, (request, response) => {
  const body = request.body;

  // check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  // check if there is person with the same name
  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
