import { Elysia, t } from 'elysia';
import { initDb } from './db/db';

const app = new Elysia()
	.decorate('db', initDb())
	.get('/users', ({ query, db }) => {
		return db.query('SELECT * FROM users ').all();
	})
	.get(
		'/users/:id',
		({ params, db }) => {
			const { id } = params;

			return db.query('SELECT * FROM users WHERE user_id = $user_id').get({
				$user_id: id,
			});
		},
		{
			params: t.Object({
				id: t.Numeric(),
			}),
		}
	)
	.post(
		'/users/',
		({ body, db }) => {
			console.info('Intering user to the table');

			const { first_name, last_name, email, about } = body;

			const insertUser = db.prepare(
				'INSERT INTO users (first_name,last_name,email,about) VALUES ($first_name, $last_name,$email,$about) RETURNING *'
			);

			const insertedUser = insertUser.get({
				$first_name: first_name,
				$last_name: last_name,
				$email: email,
				$about: about || null,
			});

			console.info(`Inserted user ${insertedUser}`);

			return insertUser;
		},
		{
			body: t.Object({
				first_name: t.String(),
				last_name: t.String(),
				email: t.String(),
				about: t.Optional(t.String()),
			}),
		}
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
