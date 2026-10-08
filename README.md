File Uploader API — a production-ready Node.js REST API designed to handle multipart form data uploads, secure file streaming, and authenticated document management.

When dealing with user profile media or document storage in Node.js applications, storing large files directly inside standard database documents hits BSON size limits quickly. This project addresses file streaming challenges by combining Multer and MongoDB GridFS.

✨ Key Highlights & Features:
Chunked Storage via GridFS: Integrates multer-gridfs-storage to stream binary data directly into uploads.files and uploads.chunks collections without memory bottlenecks.

Authentication & Password Security: Implements user registration and login workflows using bcrypt.js for password hashing and JSON Web Tokens (JWT) for protected endpoints.

File Upload & Stream Processing: Links uploaded media directly to user profile records and streams stored binary data inline back to HTTP clients.

MIME & Size Restrictions: Validates file formats (JPEG, PNG, WebP, PDF) and enforces strict file size boundaries via custom Multer filters.

Clean MVC Architecture: Modular structure separating database configuration, Mongoose schemas, controllers, middleware, and route handlers.

🛠️ Tech Stack: Node.js | Express.js | MongoDB & Mongoose | GridFS | Multer | JWT | Bcrypt
