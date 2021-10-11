const express = require("express");

const { v4:uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id }          = request.params,
        repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).send({ error: "Repository not found" });
  }

  request.repositoryIndex = repositoryIndex;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);
  return response.status(201).send(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const repositoryIndex   = request.repositoryIndex,
        updatedRepository = request.body,
        oldRepository     = repositories[repositoryIndex];

  const repository = {
    ...oldRepository, 
    ...updatedRepository,
    likes: oldRepository.likes
  };
  repositories[repositoryIndex] = repository;
  return response.send(repository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const repositoryIndex = request.repositoryIndex;

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const repositoryIndex = request.repositoryIndex;

  repositories[repositoryIndex].likes++;
  return response.send(repositories[repositoryIndex]);
});

module.exports = app;
