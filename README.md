# AWS Seller Central

> AWS Seller Central Dashboard Backend

# Quick Start 🚀

### Add a default.json file in config folder with the following

```json
{
  "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
  "jwtSecret": "secret",
}
```

### Install server dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Test production before deploy

Linux/Unix

```bash
NODE_ENV=production node server.js
```

Windows Cmd Prompt or Powershell

```bash
$env:NODE_ENV="production"
node server.js
```

Check in browser on [http://localhost:5000/](http://localhost:5000/)

### Author

Vitalii Kuzin
