import { Elysia } from 'elysia';
import { initDb } from './db/db';

const app = new Elysia()
	.decorate('db', initDb())
	.get('/users', ({ query, db }) => {
		return db.query('SELECT * FROM users ').all();
	})
	.get('/users/:id', (): string => 'single users handler')
	.post('/users/', (): string => 'create users handler')
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
