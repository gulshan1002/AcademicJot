<h1 align="center">Journal App</h1>
<h2>Deployed web server link</h2>
<a href="https://toddle-assignment-bksx.onrender.com/">Deployed Web Server Link</a>
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

In test of postman write `pm.environment.set('jwt',pm.response.json().token);` for atumatically picking token from response

The basic route starts as `https://toddle-assignment-bksx.onrender.com/api/`
