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

---

## 6. fatal: refusing to merge unrelated histories (Git)
**Error Description:**
When attempting to pull from a remote GitHub repository using `git pull origin main`, Git rejected the pull and threw a fatal error.

**Cause:**
This happens when you initialize a new local git repository (`git init`) and commit files to it, and then try to pull from a remote repository that already has its own initial commit (like a `README.md` created directly on GitHub). Git sees two entirely separate commit histories without a common ancestor and refuses to merge them to prevent accidentally overwriting files.

**Solution:**
- Ran the `git pull` command with a special flag that explicitly tells Git to allow merging these two separate histories together:
  `git pull origin main --allow-unrelated-histories`
- After the successful pull/merge, running `git push origin main` successfully updated the remote repository.

---

## 7. TypeError: Cannot read properties of undefined (reading 'token')
**Error Description:**
When accessing the `/api/auth/logout` endpoint, the application crashed when trying to read `req.cookies.token`.

**Cause:**
Express does not parse cookies by default, which means the `req.cookies` object is `undefined`. Accessing `.token` on an `undefined` object throws a `TypeError`.

**Solution:**
- Imported the `cookie-parser` package and added it as a middleware to `app.js` using `app.use(cookieParser())`. This correctly populates the `req.cookies` object with the incoming cookies.

---

## 8. TypeError: argument handler must be a function
**Error Description:**
When starting the server, Express crashed with an error `argument handler must be a function`.

**Cause:**
This happens when a route is assigned a middleware or controller function that evaluates to `undefined`. In this case, the `auth.middleware.js` file was created but completely empty on disk. When required in `auth.routes.js`, it evaluated to an empty object, making `authMiddleware.authUser` evaluate to `undefined`.

**Solution:**
- Wrote the missing authentication middleware code into `auth.middleware.js` so that it correctly exports the `authUser` function, providing Express with a valid handler.

---

## 9. 404 Not Found (Cannot POST /api/auth/get-me)
**Error Description:**
When testing the `/get-me` endpoint in Postman, the server returned a 404 Not Found error with the message `Cannot POST /api/auth/get-me`.

**Cause:**
The route in `auth.routes.js` was properly defined as a `GET` request (`authRouter.get("/get-me", ...)`), but in Postman, the request method was set to `POST` by mistake. Express could not find a POST route matching that URL, so it returned a 404.

**Solution:**
- Changed the HTTP method dropdown in Postman from `POST` to `GET` for the `/get-me` endpoint to match the backend route definition.

---

## 10. Blacklisted tokens not appearing in MongoDB, but /get-me still says "Unauthorized"
**Error Description:**
After calling `/logout` and then hitting `/get-me`, the response correctly said `"Unauthorized!"`, but the `blacklisttokens` collection in MongoDB was empty — no tokens were being saved.

**Cause:**
This was a **Postman testing order issue**, not a code bug. Here is what happened step by step:
1. Login was called and Postman saved the token as a cookie.
2. `/logout` was called once, which cleared the cookie from Postman (`res.clearCookie("token")`).
3. `/logout` was called **again** to re-test. But this time, Postman had no cookie to send because it was already cleared in step 2.
4. `req.cookies.token` was now `undefined`, so the `if (token)` check in the controller was `false` and the database insert was **skipped**.
5. When `/get-me` was called, the middleware saw no cookie at all and returned the first check: `"Unauthorized!"` (no token present) — **not** `"Token is invalid"` (token found in blacklist).

**Solution (Correct Testing Order):**
Always follow this exact sequence to correctly test token blacklisting:
1. Hit **`POST /api/auth/login`** → Postman saves a fresh token as a cookie.
2. Hit **`GET /api/auth/logout`** → The server saves the token to the `blacklisttokens` collection in MongoDB and then clears the cookie.
3. Check MongoDB — the blacklisted token should now appear.
4. Hit **`GET /api/auth/get-me`** → Since the cookie is cleared, the response will say `"Unauthorized!"`.

**How to test the "Token is invalid" path (Postman Cookie Header trick):**
To confirm that the blacklist check in `auth.middleware.js` is working, manually send the old token as a Cookie header:
1. Copy the full token value from your **Login** response (e.g., `eyJhbGciOi...`).
2. Call **`GET /api/auth/logout`** to blacklist it.
3. Go to the **`GET /api/auth/get-me`** request in Postman.
4. Click the **Headers** tab and add a new entry:
   - **Key:** `Cookie`
   - **Value:** `token=eyJhbGciOi...` (paste your copied token after `token=`)
5. Hit **Send** → You should now see `"Token is invalid"` because the token was found in the blacklist.

> **Note:** This approach works because the current implementation reads the token from `req.cookies.token`. If you later want to support `Authorization: Bearer <token>` headers (which is more common for APIs), you would need to update `auth.middleware.js` to also read from `req.headers.authorization`.
