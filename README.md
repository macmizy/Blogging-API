# Blogging-API

An API for a blog built with Node.js, ExpressJS and MongoDB

## Base URL
-https://dolphin-uniform.cyclic.app/


## Requirements
- Users should have a first_name, last_name, email, password, (you can add other attributes you want to store about the user)
- A user should be able to sign up and sign in into the blog app
- Use JWT as authentication strategy and expire the token after 1 hour
- A blog can be in two states; draft and published
- Logged in and not logged in users should be able to get a list of published blogs created
- Logged in and not logged in users should be able to to get a published blog
- Logged in users should be able to create a blog.
- When a blog is created, it is in draft state
- The owner of the blog should be able to update the state of the blog to published
- The owner of a blog should be able to edit the blog in draft or published state
- The owner of the blog should be able to delete the blog in draft or published state
- The owner of the blog should be able to get a list of their blogs. 
- The endpoint should be paginated
- It should be filterable by state
- Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
- The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, default it to 20 blogs per page. 

## Data Models
---

### User Model
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  firstname | string  |  required |
|  lastname  |  string |  required  |
|  email     | string  |  required |
|  password |   string |  required  |
| BlogsId |   array |  required  |


### Blog Model
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  createdAt |  date |  required |
|  updatedAt |  date |  required |
|  title |   string |  required  |
|  description |  string |  optional |
|  body |   string |  required  |
|  state | string  |  required, default:'draft', enum: ['draft', 'published']|
|  tags     | array  |  optional |
|  read_Count     | Number  |  |
|  reading_time     | String  |   |
|  author     | string |   |
|  userId    | ref- User  |   |

## API Endpoints
---

### User SignUp

- Route: /user/signup
- Method: POST
- Example Request: 
```
{
  "email": "user@example.com",
  "firstname": "Testing",
  "lastname": "User",
  "password": "Password123",
  
}
```

- Responses

Success
```
{
  "message": "Signup successful",
  "user": {
    "email": "user@example.com",
    "password": "$2b$10$ln5rke/22NH1nD088QY.6.y.cD..5MqGxxUhUSpAIN0cj5ET1A1Se",
    "first_name": "Testing",
    "last_name": "User",
    "blogsId": [],
    "_id": "6369005006479a24c3572efc",
    "__v": 0
  }
}
```
---
### User Login

- Route: /user/login
- Method: POST
- Example: 
```
{
    "email": 'user@example.com",
    "password": "Password123",
  
}
```

- Responses

Success
```
{
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
    eyJ1c2VyIjp7Il9pZCI6IjYzNjhmYzMwNzUyMmFiYjgzMWY5ZWY0NiIsImVtYWlsIjoidGVtbXlzYW1AZ21haWwuY29tIn0sImlhdCI6MTY2NzgyNDcxMywiZXhwIjoxNjY3ODI4MzEzfQ.
    7McIwg9TJcKo_sQQy4MXvgraGJG2qrks-Dix32ObeJo'
}
```

---
### Create a Blog

- Route: /blog/create/userId
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  "title": "Best Finance and Investment Blogs",
  "body": "If your passion or expertise lies in money management and stock trading, 
  you may want to try starting a blog on finance and investment. Like the Copyblogger
  blog, the Ahrefs blog is also a part of the Ahrefs website that sells monthly SEO
  toolset plans. The Copyblogger blog is a part of the Copyblogger company’s website
  focused on providing learning resources and services related to content marketing. 
  Run by over 50 expert writers, The Balance Small Business is a blog that helps people 
  start and run their own businesses.",
  "description": "Finance and Investment",
  "author":"mike john",
  "state": "published",
  "tags": ["finance","investment"]
}
```

- Responses

Success
```
{
  "title": "Best Finance and Investment Blogs",
  "body": "If your passion or expertise lies in money management and stock trading, 
  you may want to try starting a blog on finance and investment. Like the Copyblogger 
  blog, the Ahrefs blog is also a part of the Ahrefs website that sells monthly SEO 
  toolset plans. The Copyblogger blog is a part of the Copyblogger company’s website 
  focused on providing learning resources and services related to content marketing.
  Run by over 50 expert writers, The Balance Small Business is a blog that helps people 
  start and run their own businesses.",
  "description": "Finance and Investment",
  "author": "mike john",
  "state": "published",
  "tags": [
    "finance",
    "investment"
  ],
  "read_count": 0,
  "reading_time": "3 minutes",
  "userId": "6369005006479a24c3572efc",
  "_id": "636902e306479a24c3572f0e",
  "createdAt": "2022-11-07T13:06:43.633Z",
  "updatedAt": "2022-11-07T13:06:43.633Z",
  "__v": 0
}
```
---
### Get All Published Blogs

- Route: /blog
- Method: GET
- Header
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 0 )
    - limit (default: 20)
    - order_by (options: timestamp| read_count| reading_time)

- Responses

Success
```
{
  "title": "Best Finance and Investment Blogs",
  "body": "If your passion or expertise lies in money management and stock 
  trading, you may want to try starting a blog on finance and investment. 
  Like the Copyblogger blog, the Ahrefs blog is also a part of the Ahrefs 
  website that sells monthly SEO toolset plans. The Copyblogger blog is a 
  part of the Copyblogger company’s website focused on providing learning 
  resources and services related to content marketing. Run by over 50 expert
  writers, The Balance Small Business is a blog that helps people start and 
  run their own businesses.",
  "description": "Finance and Investment",
  "author": "mike john",
  "state": "published",
  "tags": [
    "finance",
    "investment"
  ],
  "read_count": 0,
  "reading_time": "3 minutes",
  "userId": "6369005006479a24c3572efc",
  "_id": "636902e306479a24c3572f0e",
  "createdAt": "2022-11-07T13:06:43.633Z",
  "updatedAt": "2022-11-07T13:06:43.633Z",
  "__v": 0
}
```
---

### Get All Blogs for a User
- Route: /blog/:userId
- Method: GET
- Header
    - Authorization: Bearer {token}
- Query params:
    - page (default: 0)
    - skip (default: 2)
    - state (draft || published)
- Responses

Success
```
{
  "title": "Best Finance and Investment Blogs",
  "body": "If your passion or expertise lies in money management and stock trading, 
  you may want to try starting a blog on finance and investment. Like the Copyblogger
  blog, the Ahrefs blog is also a part of the Ahrefs website that sells monthly SEO
  toolset plans. The Copyblogger blog is a part of the Copyblogger company’s website
  focused on providing learning resources and services related to content marketing. 
  Run by over 50 expert writers, The Balance Small Business is a blog that helps
  people start and run their own businesses.",
  "description": "Finance and Investment",
  "author": "mike john",
  "state": "published",
  "tags": [
    "finance",
    "investment"
  ],
  "read_count": 0,
  "reading_time": "3 minutes",
  "userId": "6369005006479a24c3572efc",
  "_id": "636902e306479a24c3572f0e",
  "createdAt": "2022-11-07T13:06:43.633Z",
  "updatedAt": "2022-11-07T13:06:43.633Z",
  "__v": 0
}
```
---

### Get a blog
- Route: /blog/:BlogId
- Method: GET

- Responses

Success
```
{
  "title": "Best Finance and Investment Blogs",
  "body": "If your passion or expertise lies in money management and stock trading, you may want 
  to try starting a blog on finance and investment. Like the Copyblogger blog, the Ahrefs blog is
  also a part of the Ahrefs website that sells monthly SEO toolset plans. The Copyblogger blog is
  a part of the Copyblogger company’s website focused on providing learning resources and services
  related to content marketing. Run by over 50 expert writers, The Balance Small Business is a blog
  that helps people start and run their own businesses.",
  "description": "Finance and Investment",
  "author": "mike john",
  "state": "published",
  "tags": [
    "finance",
    "investment"
  ],
  "read_count": 0,
  "reading_time": "3 minutes",
  "userId": "6369005006479a24c3572efc",
  "_id": "636902e306479a24c3572f0e",
  "createdAt": "2022-11-07T13:06:43.633Z",
  "updatedAt": "2022-11-07T13:06:43.633Z",
  "__v": 0
}
```

### Update Blog

- Route: /blog/updatePost/:BlogId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
    "body": "If your passion or expertise lies in money management and stock 
    trading, you may want to try starting a blog on finance and investment. 
    Like the Copyblogger blog, the Ahrefs blog is also a part of the Ahrefs 
    website that sells monthly SEO toolset plans.
}
```

- Responses

Success
```
{
  "title": "Best Finance and Investment Blogs",
  "body": "If your passion or expertise lies in money management and stock 
    trading, you may want to try starting a blog on finance and investment. 
    Like the Copyblogger blog, the Ahrefs blog is also a part of the Ahrefs 
    website that sells monthly SEO toolset plans.",
    "description": "Finance and Investment",
  "author": "mike john",
  "state": "published",
  "tags": [
    "finance",
    "investment"
  ],
  "read_count": 0,
  "reading_time": "3 minutes",
  "userId": "6369005006479a24c3572efc",
  "_id": "636902e306479a24c3572f0e",
  "createdAt": "2022-11-07T13:06:43.633Z",
  "updatedAt": "2022-11-07T13:06:43.633Z",
  "__v": 0
}

```
### Update Blog State

- Route: /blog/updateState/:BlogId
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  "state": "draft"
}
```

- Responses

Success
```
{
  "title": "Best Finance and Investment Blogs",
  "body": "If your passion or expertise lies in money management and stock 
    trading, you may want to try starting a blog on finance and investment. 
    Like the Copyblogger blog, the Ahrefs blog is also a part of the Ahrefs 
    website that sells monthly SEO toolset plans.",
    "description": "Finance and Investment",
  "author": "mike john",
  "state": "draft",
  "tags": [
    "finance",
    "investment"
  ],
  "read_count": 0,
  "reading_time": "3 minutes",
  "userId": "6369005006479a24c3572efc",
  "_id": "636902e306479a24c3572f0e",
  "createdAt": "2022-11-07T13:06:43.633Z",
  "updatedAt": "2022-11-07T13:06:43.633Z",
  "__v": 0
}

```
---
### Delete a blog

- Route: /blog/deleteblog/:blogid
- Method: DELETE
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    state: "true",
    message: "Blog deleted successfully"
}
```
---


...
