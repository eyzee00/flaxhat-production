module.exports = {
  apps: [
    {
      name: "my-app",
      script: "index.js",
      env: {
        NODE_ENV: "development",
	ATLAS_URI: "mongodb+srv://admin:ZABALITAnano123.@chat-app.ztcy5.mongodb.net/ChatApp?retryWrites=true&w=majority&appName=chat-app",
	JWT_KEY: "REALmadrid1910."
      },
      env_production: {
        NODE_ENV: "production",
	ATLAS_URI: "mongodb+srv://admin:ZABALITAnano123.@chat-app.ztcy5.mongodb.net/ChatApp?retryWrites=true&w=majority&appName=chat-app",
        JWT_KEY: "REALmadrid1910."
      },
    },
  ],
};

