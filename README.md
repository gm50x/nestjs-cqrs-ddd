# NestJS CQRS DDD (WIP)

## Overview

Welcome to NestJS CQRS DDD, a robust and scalable sample application built with cutting-edge technologies such as NestJS, CQRS, DDD, and Clean Architecture principles. This project showcases a well-organized structure that follows the concept of vertical slices, where each major domain context (payment, account, ride) has its own dedicated slice. Each slice is further divided into layers – infra, application, drivers, and domain – ensuring a clear separation of concerns and maintainability. These layers are not mandatory, in scenarios where a layer has no use, it can be easily omited from that slice without impacting the other slices.

## Installation

```bash
# install dependencies
$ npm install

# start containers
$ docker compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov

# integration tests
$ npm run test:integration

# integration tests coverage
$ npm run test:integration:cov

# all tests (unit + integration)
$ npm run test:all

# all tests (unit + integration) coverage
$ npm run test:all:cov
```
