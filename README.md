# GuideCX: Backend Assessment

You can complete the requirements below without using this repo. We've put together a starter to
take care of some of the base database and model setup, but you're not required to use this stack
if you're more comfortable with another one. The purpose of this excercise is to gauge how well
you can understand the business requirements and implement that into a Rest API

## Instructions

1. fork this repo
2. complete the tasks outlined below
3. spend no more than 4 hours
4. welcome to use whatever resources you normally would
5. send a link to the solution ahead of your interview for our review
6. bring this solution with you and be prepared to explain how you wrote it

## Background

Acme Inc needs to know how long a set of tasks is going to take their team to complete, and have those
forecasts to be updated as tasks are completed. If a task is completed early, then that will move up the
forecasted end date. If a task is completed late, then the forecast is going to be late.

The team can only work on one task at a time, and must complete that task before moving onto the next one. Each
task has a duration in days, so you can estimate when it will be completed as soon as the status changes to "In Progess".
Once a task is "Complete", then the next task in the list moves to "In Progress" and the forecasted completion date
is updated accordingly.

### Requirements

- Build an idempotent Rest API
- CRUD Task & TaskList resources, including ability to add/remove tasks in a List
- Ability to change a task status
- _Priority_: Accurate forecasted end date of a task list that responds to tasks being completed early or late

#### Task Attributes

- id: int
- name: string
- status: enum [`not_started`, `in_progress`, `complete`]
- duration: integer - number of days from start that task is expected to be completed
- started_at: datetime
- due_date: date
- dependency_id: FK (another task)
- task_list_id: FK
- created_at
- updated_at

#### TaskList Attributes

- id: int
- name: string
- started_at: datetime
- due_date: date
- forecasted_completion_date: date
- tasks: Task[]
- created_at
- updated_at

## Technology

- Node 14 + Express
- TypeScript
- Docker
- Jest
- Prettier
- Eslint

## Setup

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

```
$ cp .env.example .env
```

```
$ npm install
$ npm run up

```

## Debugging

If you're using VS Code then you can use the built-in debugger. After you have the app running with `docker-compose` then you can start the `Docker: Debugger` in the debugger tab.
