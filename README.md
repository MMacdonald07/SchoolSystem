# School_System

School_System uses SpringBoot to build a backend that connects to PostgreSQL, linking any users to a database with users having unique roles e.g. teachers who can view their students' marks and admins who can modify the user database: adding new users, deleting existing ones and additionally updating them.

## Installation

### Clone

Clone this repository to your machine using https://github.com/MMacdonald07/SchoolSystem.git.

### Setup

Use the package manager npm to install prerequisite node modules so the program can be run:

```bash
npm install
```

Download [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) and create an account on the SQL shell (PSQL).

## Usage

Start the backend using any Java IDE (Eclipse, intelliJ IDEA, etc.) and selecting the SchoolApplication run configuration.

Input your PSQL credentials and the database URL in src/main/resources/applications.properties. Also feel free to add any other database configuration here.

The frontend can be started up by running the following commands from the main directory:

```bash
cd src/main/frontend

npm run start
```

It is advised to create a user of role admin first so credentials are available to log into the program and the user database can be easily modified.

To change a user's role the user_roles database will have to be altered in the SQL shell.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Please make sure to update tests as appropriate.
