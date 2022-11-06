# Blog App
This is an api for a blog app

---

## Requirements
1. Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
2. A user should be able to sign up and sign in into the blog app
3. Use JWT as authentication strategy and expire the token after 1 hour
4. A blog can be in two states; draft and published
5. Logged in and not logged in users should be able to get a list of published blogs created
6. Logged in and not logged in users should be able to to get a published blog
7. Logged in users should be able to create a blog.
8. When a blog is created, it is in draft state
9. The owner of the blog should be able to update the state of the blog to published
10. The owner of a blog should be able to edit the blog in draft or published state
11. The owner of the blog should be able to delete the blog in draft or published state
12. The owner of the blog should be able to get a list of their blogs. 
   a.The endpoint should be paginated
   b. It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, 
  a. default it to 20 blogs per page. 
  b. It should also be searchable by author, title and tags.
  c. It should also be orderable by read_count, reading_time and timestamp
15. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
16. Come up with any algorithm for calculating the reading_time of the blog.
17. Write tests for all endpoints

---
## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with .env
- run `npm run start:dev`

---
## Base URL
- https://altschoolblog.herokuapp.com/


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  username |  string |  required, unique |
|  first_name | string  |  required|
|  last_name  |  string |  required  |
|  email     | string  |  required,unique |
|  password |   string |  required  |
|  createdAt |  date |  required |
|  updatedAt |  date |  required |



### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  title|  string |  required |
|  description | string  |  optional|
|  tags     | array  |  optional |
|  author|  objectId |  required|
|  state|  string |  optional,enum:['draft','published'],default:'draft'|
|  read_count|  number |  optional,default:0 |
|  reading_time|  number |  optional |
|  body|  string |  required |
|  createdAt |  date |  required |
|  updatedAt |  date |  required |




## APIs
---

### Register User

- Route: /api/v1/auth/register
- Method: POST
- Body: 
```
{
    first_name : "diepiriye",
    last_name:"george",
    username:"george",
    email:"george@gmail.com",
    password:"12345"
}
```

- Responses

Success
```
{
    "message": "Registration succesful",
    "user": {
        "first_name": "diepiriye",
        "last_name": "george",
        "username": "george",
        "email": "george@gmail.com",
        "password": "U2FsdGVkX18S3pHvLhZ/lBfooJzTYky8uiWtZZ3Ad1E=",
        "_id": "6366d5ce59dbbf835b91e93b",
        "createdAt": "2022-11-05T21:29:51.520Z",
        "updatedAt": "2022-11-05T21:29:51.520Z",
        "__v": 0
    }
}
```
---
### Login User

- Route: /api/v1/auth/login
- Method: POST
- Body: 
```
{
    username:"george",
    password:"12345"
}
```

- Responses

Success
```
{
    "_id": "6366d5ce59dbbf835b91e93b",
    "first_name": "diepiriye",
    "last_name": "george",
    "username": "george",
    "email": "george@gmail.com",
    "createdAt": "2022-11-05T21:29:51.520Z",
    "updatedAt": "2022-11-05T21:29:51.520Z",
    "__v": 0,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNjZkNWNlNTlkYmJmODM1YjkxZTkzYiIsInVzZXJuYW1lIjoiZ2VvcmdlIiwiaWF0IjoxNjY3NjgzODkxLCJleHAiOjE2Njc2ODc0OTF9.prsNJTl9IAQEnXpxmBCL52OzWD1BTVpStz5xPhaXNEs"
}
```

---
### Create Blog

- Route: /api/v1/blog/
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    title:"this is the title",
    body:"During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock. In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event,"
    
}
```

- Responses

Success
```
{
    "status": true,
    "blog": {
        "title": "this is the title",
        "description": "",
        "tags": [],
        "author": "6366d5ce59dbbf835b91e93b",
        "state": "draft",
        "read_count": 0,
        "reading_time": 16800,
        "body": "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event,",
        "_id": "6366d74159dbbf835b91e941",
        "createdAt": "2022-11-05T21:36:01.104Z",
        "updatedAt": "2022-11-05T21:36:01.104Z",
        "__v": 0
    }
}
```
---
### Get Single Blog

- Route: api/v1/blog/:blogId
- Method: GET

- Responses

Success
```
{
    "status": true,
    "blog": {
        "_id": "6366d74159dbbf835b91e941",
        "title": "this is the title",
        "description": "",
        "tags": [],
        "author": {
            "_id": "6366d5ce59dbbf835b91e93b",
            "first_name": "diepiriye",
            "last_name": "george",
            "username": "george",
            "email": "george@gmail.com",
            "password": "U2FsdGVkX18S3pHvLhZ/lBfooJzTYky8uiWtZZ3Ad1E=",
            "createdAt": "2022-11-05T21:29:51.520Z",
            "updatedAt": "2022-11-05T21:29:51.520Z",
            "__v": 0
        },
        "state": "draft",
        "read_count": 1,
        "reading_time": 16800,
        "body": "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event,",
        "createdAt": "2022-11-05T21:36:01.104Z",
        "updatedAt": "2022-11-05T21:40:07.618Z",
        "__v": 0
    }
}
```
---

### Get All published blogs

- Route: /api/v1/blog/published
- Method: GET

- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    - order_by (default: createdAt)
    - order (options: asc | desc, default: desc)
    - author
    - title
    - tags
    - state
    - createdAt

- Responses

Success
```
{
    "status": true,
    "blogs": [
        {
            "_id": "6366d74159dbbf835b91e941",
            "title": "this is the title",
            "description": "",
            "tags": [],
            "author": "6366d5ce59dbbf835b91e93b",
            "state": "published",
            "read_count": 2,
            "reading_time": 16800,
            "body": "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event,",
            "createdAt": "2022-11-05T21:36:01.104Z",
            "updatedAt": "2022-11-05T21:41:32.267Z",
            "__v": 0
        }
    ]
}
```
---


### Get All blogs belonging to a user

- Route: /api/v1/blog/all
- Method: GET

- Query params: 
    - page (default: 1)
    - per_page (default: 20)
    -state (default:"published")
- Responses

Success
```
{
    "status": true,
    "blogs": [
        {
            "_id": "6366d74159dbbf835b91e941",
            "title": "this is the title",
            "description": "",
            "tags": [],
            "author": "6366d5ce59dbbf835b91e93b",
            "state": "published",
            "read_count": 2,
            "reading_time": 16800,
            "body": "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event,",
            "createdAt": "2022-11-05T21:36:01.104Z",
            "updatedAt": "2022-11-05T21:41:32.267Z",
            "__v": 0
        }
    ]
}
```
---

### Edit Blog

- Route: /api/v1/blog/:blogId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    title:"this is the title",
    body:"During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event, pore pressure increase slowly propagates into the surrounding fracture network.",
    description:"this is a description"

    
}
```

- Responses

Success
```
{
    "status": true,
    "message": "Blog updated Successfully",
    "updatedBlog": {
        "_id": "6366d74159dbbf835b91e941",
        "title": "this is the title",
        "description": "this is a description",
        "tags": [],
        "author": "6366d5ce59dbbf835b91e93b",
        "state": "published",
        "read_count": 2,
        "reading_time": 19800,
        "body": "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event, pore pressure increase slowly propagates into the surrounding fracture network.",
        "createdAt": "2022-11-05T21:36:01.104Z",
        "updatedAt": "2022-11-05T22:23:31.367Z",
        "__v": 0
    }
}
```
---

### Update Blog to Published

- Route: /api/v1/blog/update/:blogId
- Method: PATCH
- Header
    - Authorization: Bearer {token}



- Responses

Success
```
{
    "status": true,
    "message": "Blog updated Successfully",
    "updatedBlog": {
        "_id": "6366d74159dbbf835b91e941",
        "title": "this is the title",
        "description": "this is a description",
        "tags": [],
        "author": "6366d5ce59dbbf835b91e93b",
        "state": "published",
        "read_count": 2,
        "reading_time": 19800,
        "body": "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase, such increase can significantly affect slip evolution and speed and, furthermore, in the post-seismic phase it can control the Aftershock sequence because, after the main event, pore pressure increase slowly propagates into the surrounding fracture network.",
        "createdAt": "2022-11-05T21:36:01.104Z",
        "updatedAt": "2022-11-05T22:29:16.367Z",
        "__v": 0
    }
}
```
---

### Delete Blog

- Route: /api/v1/blog/:blogId
- Method: DELETE
- Header
    - Authorization: Bearer {token}


- Responses

Success
```
{
    "status": true,
    "message": "Blog deleted successfully"
}
```
---


## Contributor
- George Diepiriye