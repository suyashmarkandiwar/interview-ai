# Errors and Solutions

## 1. Server is running on port http://localhost:undefined
**Error Description:**
When running the server, the port was showing as `undefined` instead of the expected port number.

**Cause:**
`process.env.PORT` was `undefined` because the environment variables from the `.env` file were not being loaded into Node.js by default.

**Solution:**
- Added `require("dotenv").config();` to the top of `server.js` to load the `.env` file.
- Added a fallback port in `server.js` as a best practice: `const PORT = process.env.PORT || 3000;`.

---

## 2. Error: Cannot find module './src/routes/auth.routes'
**Error Description:**
The application crashed with `MODULE_NOT_FOUND` when trying to import `auth.routes` inside `src/app.js`.

**Cause:**
The path to the routes file was incorrect. Since `app.js` is already inside the `src/` folder, the relative path `./src/routes/auth.routes` told Node to look for `src/src/routes/...` which did not exist.

**Solution:**
- Changed the import path in `src/app.js` to be relative to its current directory:
  `const authRouter = require("./routes/auth.routes");`

---

## 3. TypeError: userModel.find is not a function
**Error Description:**
When attempting to register a user, the server threw an error stating `userModel.find is not a function`.

**Cause:**
- `src/models/user.model.js` was completely empty on disk, so requiring it returned an empty object `{}` rather than a valid Mongoose model. 
- Additionally, `.find()` returns an array. In Javascript, an array is always a "truthy" value, which would make the `if (isUserAlreadyExists)` check always evaluate to true.

**Solution:**
- Re-wrote the Mongoose schema and model export correctly into `src/models/user.model.js`.
- Changed `userModel.find` to `userModel.findOne` in `src/controllers/auth.controller.js` so that it correctly returns `null` when a user doesn't exist.

---

## 4. Error: secretOrPrivateKey must have a value
**Error Description:**
Logging in or registering a user threw an error from the `jsonwebtoken` package stating `secretOrPrivateKey must have a value`.

**Cause:**
The `jwt.sign()` function requires a secret key as its second argument, but `process.env.JWT_SECRET` was returning `undefined` because the key was missing from the `.env` file.

**Solution:**
- Added a placeholder secret to the `.env` file: `JWT_SECRET = my_super_secret_jwt_key_12345`.

---

## 5. Invalid passwords still successfully logging in via Postman
**Error Description:**
Logging in with the wrong password still returned a "User logged in successfully" response.

**Cause:**
In `auth.controller.js`, the code was calling `const isPasswordValid = bcrypt.compare(password, user.password);` without the `await` keyword. Because `bcrypt.compare` returns a Promise, `isPasswordValid` became a pending Promise object. Since all objects (including Promises) are "truthy" in Javascript, `!isPasswordValid` evaluated to `false`, effectively skipping the invalid password check entirely.

**Solution:**
- Added the `await` keyword to properly resolve the promise to a boolean:
  `const isPasswordValid = await bcrypt.compare(password, user.password);`
