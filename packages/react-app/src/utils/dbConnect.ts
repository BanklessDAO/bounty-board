import mongoose, { Mongoose } from 'mongoose';
import ServiceUtils from './ServiceUtils';

const MONGODB_URI = ServiceUtils.getMongoURI();
const globalAny: any = global;

if (!MONGODB_URI) {
	throw new Error(
		'Please define the MONGODB_URI environment variable inside .env.local'
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalAny.mongoose;

if (!cached) {
	cached = globalAny.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			bufferCommands: false,
			bufferMaxEntries: 0,
			useFindAndModify: false,
			useCreateIndex: true,
		};

		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseConnect: Mongoose) => {
			return mongooseConnect;
		});
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export default dbConnect;
