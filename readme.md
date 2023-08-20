<h1 align="center">Toddle Backend Assignment</h1>
<h2>Deployed web server link</h2>
<a href="https://toddle-assignment-bksx.onrender.com/">Deployed Web Server Link</a>
<h2>API Documentation</h2>
<a href="https://documenter.getpostman.com/view/21198977/2s9Y5SX69t">Postman Collection</a>

<h3>Database Design</h3>

![alt text](./Screenshots/ER%20Diagram.png)

SIGNUP

```sh
curl -d '{"name":"Gulshan Kumar",email":"gulshan.k20@iiits.in","password":"12345678", "role":"student"}' -H 'Content-Type: application/json' https://toddle-assignment-bksx.onrender.com/api/user/signup

```

LOGIN

```sh
curl \
-d '{"email":"test@gmail.com","password":"1234567890", "role":"student"}' \
-H 'Content-Type: application/json' \
https://toddle-assignment-bksx.onrender.com/api/user/login
```

<h3>Export the Token Created at a time of Login</h3>

```
export TOKEN = Token which you get after Login
```

Like this we can do for rest of the API's for testing

Postman Collection Link : `https://documenter.getpostman.com/view/21198977/2s9Y5SX69t`

In test of postman write `pm.environment.set('jwt',pm.response.json().token);` for atumatically picking token from response

The basic route starts as `https://toddle-assignment-bksx.onrender.com/api/`
