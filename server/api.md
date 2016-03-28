#Server API Documentation

**Signup User**
----
  Signup user for app.

* **URL**

  /signup

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**

 **Required:**

 `username=[string]`

 `password=[string]`

 `email=[string]`

* **Success Response:**

  * **Code:** 201 CREATED<br />
    **Content:** `{ txn : true, user : [Object object] }`

* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ txn : false, err : "Missing required fields." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/signup",
      dataType: "json",
      type : "POST",
      data : {
        username : "griff",
        password : "password",
        email : "griffin@griffin.com"
      },
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Login User (POST)**
----
  Login user for app.

* **URL**

  /login

* **Method:**

  `POST`

*  **URL Params**

  None

* **Data Params**

 **Required:**

 `username=[string]`

 `password=[string]`

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** `{ txn : true, user : [Object object] }`

* **Error Response:**

  * **Code:** 403 BAD REQUEST <br />
    **Content:** `{ txn : false, err : "Incorrect email or password." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/login",
      dataType: "json",
      type : "POST",
      data : {
        username : "griff",
        password : "password",
      },
      success : function(r) {
        console.log(r);
      }
    });
  ```

**Login User (GET)**
----
  Login user for app.

* **URL**

  /login

* **Method:**

  `GET`

*  **URL Params**

  None

* **Data Params**

 **Required:**

  None

* **Success Response:**

  * **Code:** 200 OK<br />
    **Content:** `{ txn : true, user : [Object object] }`

* **Error Response:**

  * **Code:** 419 AUTHENTICATION TIMEOUT <br />
    **Content:** `{ txn : false, err : "Incorrect email or password." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/login",
      dataType: "json",
      type : "GET",
      data : {},
      success : function(r) {
        console.log(r);
      }
    });
  ```
