[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Mini project: Backend Service For CSV File Uploading

## Requirements

```shell
docker >= 1.18.0
node = ^12
```
## Setup Local

1. MySQL

	- Install to local machine
	- Or using docker as below
	  MySQL (MacIntel):

	  ```bash
	  $ docker run --name test_mysql -e MYSQL_USER={your-username} -e MYSQL_PASSWORD={your-password} -e MYSQL_DATABASE={your-database} -e MYSQL_ROOT_PASSWORD={your-root-password} -p 3306:3306 -d mysql:8
	  ```

	  MySQL (MacM1):

	  ```bash
	  $ docker run --name test_mysql --platform=linux/amd64 -e MYSQL_USER={your-username} -e MYSQL_PASSWORD={your-password} -e MYSQL_DATABASE={your-database} -e MYSQL_ROOT_PASSWORD={your-root-password} -p 3306:3306 -d mysql:8
	  ```

	- Incase Service cannot connect to data base with `Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client`:
	  - Access to mysql's docker container:

	  ```bash
	  $ docker exec -it {container-id} bash
	  ```
		- Access to mysql shell with root user using root password:

	  ```bash
	  $ mysql -u root -p
	  ```
		- Run following commands to switch back to 'mysql_native_password' authentication plugin:

	  ```bash
	  $ ALTER USER '{your-username}'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'your-new-password';
	  $ FLUSH PRIVILEGES; 
	  ```

2. Environment

	```shell
	$ cp .env.sample .env
	```

## Dependency Installation

```bash
$ npm install
```

## Running Migrations

```bash
$ npm run dbm:run
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

**WARNING: only do this in your local (since this will clear table records)**

```bash
# unit tests
$ npm run test
```
