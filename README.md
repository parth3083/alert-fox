# 🦊 AlertFox – IT Alert & Ticket Management System

AlertFox is a full-stack web application designed to monitor system alerts and manage support tickets efficiently. It helps IT teams track critical issues (e.g., CPU spikes, memory overuse) and resolve them through a streamlined ticketing system.

## 📌 Purpose of the Project

The goal of AlertFox is to provide a lightweight and customizable alternative to complex monitoring solutions. It allows system admins to monitor, acknowledge, and resolve system alerts while automatically generating tickets for critical incidents.

## 🎯 Key Features

- **Real-time System Monitoring**: Track CPU, memory, and disk usage.
- **Automated Ticket Creation**: Generate tickets for critical alerts.
- **User Roles & Authentication**: Secure access for admins, support staff, and users.
- **Ticket Lifecycle Management**: Open, acknowledge, resolve, and close tickets.
- **Customizable Alert Rules**: Define thresholds for different alert levels.
- **Dashboard View**: Visualize alerts and ticket status in real-time.

## 🛠️ Tech Stack

- **Frontend**: Next.js (TypeScript) + Tailwind CSS
- **Backend**: Node.js (Express + Prisma ORM)
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Real-time Updates**: WebSockets / Polling

## 🗄️ Database Model

The database schema is designed to support the core functionalities of AlertFox:

- **User**: Represents users of the system with roles such as Admin, Support, or User.
- **Alert**: Stores system alerts with details like type, severity, and status.
- **Ticket**: Tracks tickets generated for alerts, including their status, priority, and resolution notes.

### Schema Overview

- **User**
  - `id`: Unique identifier for the user.
  - `name`: Name of the user.
  - `email`: Unique email address.
  - `externalId`: External identifier for integration purposes.
  - `role`: Role of the user (`ADMIN`, `SUPPORT`, `USER`).
  - `createdAt`: Timestamp of user creation.

- **Alert**
  - `id`: Unique identifier for the alert.
  - `type`: Type of the alert (e.g., CPU, Memory).
  - `severity`: Severity level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
  - `status`: Current status (`NEW`, `IN_PROGRESS`, `RESOLVED`).
  - `message`: Description of the alert.
  - `createdAt`: Timestamp of alert creation.

- **Ticket**
  - `id`: Unique identifier for the ticket.
  - `alertId`: Associated alert ID (optional).
  - `assignedToId`: User ID of the assigned support staff (optional).
  - `status`: Current status (`OPEN`, `IN_PROGRESS`, `CLOSED`).
  - `priority`: Priority level (`LOW`, `MEDIUM`, `HIGH`).
  - `resolutionNotes`: Notes on how the ticket was resolved.
  - `createdAt`: Timestamp of ticket creation.
  - `updatedAt`: Timestamp of the last update.
