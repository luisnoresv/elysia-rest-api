import { faker } from '@faker-js/faker';
import Database from 'bun:sqlite';
import { User } from './models';

export function initDb() {
	const db = new Database('elysia-rest-api.db', { create: true });

	db.run(`CREATE TABLE IF NOT EXISTS users
  (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    about TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
  )`);

	console.info(`Connected to database: ${db.filename} `);
	seedDb(db);

	return db;
}

function seedDb(db: Database) {
	const users = db.query(`select user_id FROM users`).all();

	if (users.length === 0) {
		const insert = db.prepare(
			'INSERT INTO users (first_name,last_name,email,about) VALUES ($first_name,$last_name,$email,$about)'
		);
		const insertUsers = db.transaction((users) => {
			for (const user of users) insert.run(user);
			return users.length;
		});

		let usersSeedList: User[] = [];

		for (let index = 0; index < 100; index++) {
			const userForSeed: User = {
				$first_name: faker.person.firstName(),
				$last_name: faker.person.lastName(),
				$email: faker.internet.email(),
				$about: faker.person.bio(),
			};
			usersSeedList.push(userForSeed);
		}

		const count = insertUsers(usersSeedList);

		console.info(`Inserted ${count} users`);
	}
}
