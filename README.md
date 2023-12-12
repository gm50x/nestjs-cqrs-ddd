# NestJS CQRS DDD

## Overview

Welcome to NestJS CQRS DDD, a robust and scalable sample application built with cutting-edge technologies such as NestJS, CQRS, DDD, and Clean Architecture principles. This project showcases a well-organized structure that follows the concept of vertical slices, where each major domain (payment, account, ride) has its dedicated slice. Each slice is further divided into layers – infra, application, drivers, and domain – ensuring a clear separation of concerns and maintainability.

## Features

### CQRS Implementation

The project leverages NestJS's default CQRS module, which facilitates in-memory publishing of events. To enhance this mechanism, we have seamlessly integrated RabbitMQ, ensuring events are efficiently published to an exchange for widespread consumption. This not only improves scalability but also enables seamless communication between different parts of the application.

### Configuration Management

Our project is equipped with a comprehensive configuration setup, covering essential aspects such as logging, error handling, common middlewares, API versioning, and a request auditing mechanism. The latter anonymizes known sensitive properties from both incoming requests and outgoing responses, prioritizing security and privacy.

### Testing Strategy

At the heart of our project lies a robust testing strategy. We've meticulously designed the configuration of the NestJS project to allow the execution of unit tests in isolation from integration tests, optimizing the build process in continuous integration pipelines. Additionally, our integration tests are set up with minimal setup, ensuring a streamlined and efficient testing process. These tests encompass all existing test files throughout the entire project, ensuring thorough validation.

## Getting Started

To explore the capabilities of this project, follow the steps outlined in the Installation Guide and refer to this Documentation for detailed information on the architecture, features, and usage.

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

## Layers

### Drivers

The Drivers Layer serves as the primary entry point for a slice, acting as the interface between external entities and the internal application logic. This layer is designed to handle various types of interactions, including HTTP requests, message-based communication, and internal method calls. Its main components are HTTP controllers, message controllers. For internal communication between slices we are leveraging Nest's Query Bus.

### Infrastructure (Infra)

The Infrastructure Layer plays a critical role in bridging the gap between the internal application logic and the external world. Operating as an anti-corruption layer, this infrastructure is dedicated to implementing the ports declared in the Application Layer, effectively abstracting away complexities from the outside world. This layer encompasses repository implementations and provides abstractions for service communication, including storage, pubsub, method calls and any other requirement.

### Application

The Application Layer serves as the orchestrator of business logic, embodying the core use-cases defined by the domain. Leveraging NestJS's CQRS commands and queries, this layer seamlessly translates business requirements into executable actions, encapsulating the application's operational logic.

### Domain

The Domain Layer is the heart of the application, where Domain-Driven Design (DDD) principles come to life. This layer houses a rich collection of DDD artifacts, including entities, value objects, domain services, and other strategic design elements. The primary purpose of the Domain Layer is to model and encapsulate the core business logic, ensuring a deep alignment with the problem domain.

## Project Structure

```bash
root
├── libs
│   ├── amqp
│   ├── audit
│   ├── config
│   ├── core
│   └── tracing
├── src
│   └── entrypoint (main)
├── account
│   ├── domain
│   ├── application
│   ├── infra
│   └── drivers
├── payment
│   ├── domain
│   ├── application
│   ├── infra
│   └── drivers
└── ride
    ├── domain
    ├── application
    ├── infra
    └── drivers
```

## libs

The libs directory serves as a central hub for cross-cutting concerns and shared functionalities. It encompasses features that are applicable across various parts of the application, promoting reusability and maintaining a clean, modular architecture.

### Core Lib

#### Domain Events

The core library is dedicated to housing domain events, enabling wide consumption across different parts of the application. Domain events capture significant changes in the system and serve as a powerful tool for decoupling components and maintaining consistency throughout the application.

#### DDD Base Implementation

The core library provides a fundamental implementation of Domain-Driven Design (DDD) principles, offering key interfaces and base classes for building domain-centric components.

#### Entity Interfaces and Base Implementation

Within the core library, you'll find interfaces for entities and base implementations that set the foundation for modeling domain entities. These interfaces guide the definition of entities in different domains, ensuring a standardized approach to encapsulating business logic.

#### Repository Interfaces and Base Implementation

The core library introduces interfaces for repositories, outlining the contract for data access in a domain-agnostic manner. Additionally, a base repository implementation for each data source (currently Mongoose only) is provided, simplifying the process of creating repositories specific to the chosen data storage technology.

#### Entity Factory Interfaces

The core library defines interfaces for entity factories, offering a blueprint for creating domain entities. This abstraction allows for consistent and flexible entity creation processes across different parts of the application.

#### Entity Schema Factory Interfaces

The core library defines interfaces for schema factories, offering a blueprint for transforming domain entities into datasource specific models and vice-versa. This abstraction allows for consistent and flexible persistency of entities across a variety of datasources.

## src

The src directory is the core of the application, housing service slices that encapsulate specific domains. This directory follows a vertical slice architecture, where each major domain (payment, account, ride) has its dedicated slice. Each slice is further organized into layers, including infra, application, drivers, and domain, to ensure a clean separation of concerns and maintainability.

### Service Slices (domain contexts)

- The **payment** slice within the src directory focuses on functionalities related to payments.
- The **account** slice is responsible for managing user accounts and associated functionalities.
- The **ride** slice focuses on functionalities related to ride services, handling aspects such as ride requests, tracking, and coordination.
````
