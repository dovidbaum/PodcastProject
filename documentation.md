
# PROJECT NAME

---

Name: Dovid Baum

Date: 06/11/2019

Project Topic: 

URL: 

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     title     `Type: String`
- `Field 2`:     author       `Type: ...`
- `Field 3`:     rating       `Type: ...`
- `Field 4`:     description       `Type: ...`
- `Field 5`:     image       `Type:file`
- `Field 6`:     ratings       `Type:array`
- `Field 7`:     time       `Type:file`

Schema: 
```javascript
{"podcasts":[
    {"title":"asdasd",
    "author":"asdasd",
    "rating":"",
    "description":"<p>dsfad</p>\n",
    "image":"f9ca3a0de2ed710dc09f2fbf9a726190",
    "ratings":[null],"time":"2019-04-11T17:50:51-04:00"}
    ]}
```

### 2. Add New Data

note: I gave HTML form route and POST endpoint route same path, they both work when tested
 
HTML form route: `/create`

POST endpoint route: `/create`

Example Node.js POST request to endpoint: 
```javascript
     var request = require("request");
 
     var options = {
     method: 'POST',
     url: 'http://localhost:3000/create',
     headers: {
         'content-type': 'application/x-www-form-urlencoded'
     },
     form: {
         title: 'Postman Podcast',
         author: 'Postman Author',
         image: "http://i.imgur.com/iGLcfkN.jpg",
         rating: 1.3,
         description: 'Incredible podcast about Postman'
         }
     };
 
     request(options, function (error, response, body) {
     if (error) throw new Error(error);
 
     console.log(body);
     }); 
```

### 3. View Data

 GET endpoint route: `/getPodcasts`

### 4. Search Data

Search Field: title

### 5. Navigation Pages

Navigation Filters
1. Heavy Dogs -> `/heaviest`
2. Select a Breed -> `/breed/:breed_name`
3. Young Dog -> `/youngest`
4. Random Dog -> `/random`
5. Alphabetical Dogs -> `/alphabetical`

