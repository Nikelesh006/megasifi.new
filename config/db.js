import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const rawUri = process.env.MONGODB_URI?.trim();
    const baseUri = rawUri?.replace(/^['"]|['"]$/g, "");

    const dbName = process.env.MONGODB_DB || "quickcart";

    if (!baseUri) {
      throw new Error("Missing MONGODB_URI environment variable.");
    }

    const hasValidScheme = /^mongodb(\+srv)?:\/\//.test(baseUri);
    if (!hasValidScheme) {
      throw new Error('Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://"');
    }

    const [uriWithoutQuery, queryString] = baseUri.split("?");
    const hasDbPath = /mongodb(\+srv)?:\/\/[^\/]+\/[^\/]+/.test(uriWithoutQuery);

    let connectionString = uriWithoutQuery;
    if (!hasDbPath) {
      connectionString = `${uriWithoutQuery.replace(/\/?$/, "")}/${dbName}`;
    }

    if (queryString) {
      connectionString += `?${queryString}`;
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(connectionString, opts).then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;