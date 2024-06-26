import request from 'supertest';
import { connectToMongoDB, disconnectFromMongoDB } from '../services/mongoConnection';
import app from '../app';
import dotenv from 'dotenv'
import { signInData, signUpData, signInUnregisteredUser, signInWrongPassword,blogData } from '../mock/static';
import  User  from '../models/auth/userSchema';
import QuerrySchema from '../models/QuerrySchema';
import mongoose, { mongo } from 'mongoose';
import fs from 'fs';
import path from 'path';
const testImage = path.join(__dirname, 'im.jpg');

let token: string;
let id: mongoose.Types.ObjectId;
let userNames: mongoose.Types.ObjectId;
let userId: mongoose.Types.ObjectId;
let querryId: mongoose.Types.ObjectId;

dotenv.config()
const devDatabaseURI = process.env.TEST_DATABASE_URL as string;

jest.setTimeout(10000);

describe("Welcome to my blog", () => {
  beforeAll(async () => {
    await connectToMongoDB(devDatabaseURI);
    await User.deleteMany();
  });

  afterAll(async () => {
    await disconnectFromMongoDB();
  });

  describe("Welcome API message", () => {
    test("it should return 200 and welcome message ", async () => {
      const { body } = await request(app)
        .get("/api/v1")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(body.message).toStrictEqual("Welcome to my blogs API");
    });
  });

  describe("Users Api crud", () => {
    test("it should return 403 if is not authorized", async () => {
      const { body } = await request(app)
        .get("/api/v1/users")
        .expect("Content-Type", /json/)
        .expect(403);

      expect(body.message).toStrictEqual("access denied");
    });
    test("It should return signup and login", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(signUpData)
        .expect(201);
        userNames = response.body.data.names;
        userId = response.body.data._id;
        
    
      const loginResponse = await request(app)
        .post("/api/v1/users/login")
        .send(signInData)
        .expect(200);
      token = loginResponse.body.token;
    });
    

    test("it should return 404 when User is not found", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send(signInUnregisteredUser)
        .expect(404);
      expect(response.body.message).toStrictEqual("User not found");
    });
    test("it should return 400 when wrong password is inserted", async () => {
      const response = await request(app)
        .post("/api/v1/users/login")
        .send(signInWrongPassword)
        .expect(400);
      expect(response.body.message).toStrictEqual("Wrong password");
    });
    
    //get blog tests
// test("it should return 200 and the list of blogs", async () => {
//   const blogsResponse = await request(app)
//   .get("/api/v1/blogs")
//   .expect(200)
//   expect(blogsResponse.body.message).toStrictEqual("Blogs with comments");
//   })  

// get all users tests
test("it should return 200 and the list of users", async () => {
  const usersResponse = await request(app)
  .get("/api/v1/users")
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  })  


 //create blog test

 test('should create a blog and return 201 and the blog data', async () => {
  const blogData = {
    category: "Experience",
    author: "Sammy",
    title: 'Test Blog Title',
    description: 'This is a test blog description.',
    coverImage: 'im.jpg',
  };

  const responsez = await request(app)

    .post('/api/v1/blogs')
    .set('Authorization', `Bearer ${token}`)
    .field('category', blogData.category)
    .field('author', blogData.author)
    .field('title', blogData.title)
    .field('description', blogData.description)
    .attach(
      "coverImage",
      fs.readFileSync(path.join(__dirname, "im.jpg")),
      "im.jpg",
)
    .expect(201)
  id = responsez.body.data._id;
  expect(responsez.body).toHaveProperty('message', 'Blog created successfuly');
  expect(responsez.body.data).toHaveProperty('title', blogData.title);
  expect(responsez.body.data).toHaveProperty('description', blogData.description);
});
 //create blog test without title

 test('should create a blog and return 400 while creating blog without title', async () => {
  const blogData = {
    category: "Experience",
    author: "Sammy",
    description: 'This is a test blog description.',
    coverImage: 'im.jpg',
  };

  const responsez = await request(app)
    .post('/api/v1/blogs')
    .set('Authorization', `Bearer ${token}`)
    .attach(
      "coverImage",
      fs.readFileSync(path.join(__dirname, "im.jpg")),
      "im.jpg",
    )
    .expect(400)
});
 
//get single blog test
test('it should return 200 and a single blog data', async () =>{
  const singleBlog = await request(app)
  .get(`/api/v1/blogs/${id}`)
  .expect(200)
})
test('it should return 404 if blog is not founda', async () =>{
  const singleBlog = await request(app)
  .get(`/api/v1/blogs/65fb68730bd742d8b28c56a3`)
  .expect(404)
})

//update single blog test
test('it shoult return 201 and updated blog data', async () =>{
  const newBlogData = {
    category: "New Experience",
    author: "Sammy Joe",
    title: 'New Test Blog Title',
    description: 'New blog description test.',
    coverImage: 'im.jpg',
  };

  const updatedResponse = await request(app)
    .patch(`/api/v1/blogs/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .field('category', blogData.category)
    .field('author', blogData.author)
    .field('title', blogData.title)
    .field('description', blogData.description)
    .attach(
      "coverImage",
      fs.readFileSync(path.join(__dirname, "im.jpg")),
      "im.jpg",
    )
    .expect(201)
})
test('it shoult return 404 if blog to update not found', async () =>{
  const newBlogData = {
    category: "Experience",
    author: "Sammy",
    title: 'New Test Blog Title',
    description: 'New blog description test.',
    coverImage: 'im.jpg',
  };

  const updatedResponse = await request(app)
    .patch(`/api/v1/blogs/65fb68730bd742d8b28c56a3`)

    .set('Authorization', `Bearer ${token}`)
    .field('title', blogData.title)
    .field('description', blogData.description)
    .attach(
      "coverImage",
      fs.readFileSync(path.join(__dirname, "im.jpg")),
      "im.jpg",
    )
    
    .expect(404)
})

// add comment to blog with specific id
test('it should return 201 and comment data', async () => {
  const commentData = {
    commentMessage: 'New Comment Message',
    blogId: id,
    username:userNames
  }
  const commentResponse = await request(app)
  .post(`/api/v1/blogs/${id}/comments`)
  .set('Authorization', `Bearer ${token}`)
  .send(commentData)
  .expect(201)

})

// add like to the blog with specific id
test('it should return 201 and liked  data', async () => {
  const likeData = {
    isLike: true,
    blogId: id,
    userId: userId
  }

  const likeResponse = await request(app)
  .post(`/api/v1/blogs/${id}/likes`)
  .set('Authorization', `Bearer ${token}`)
  .send(likeData)
  .expect(201)

})
test('should create a blog and return 400 if no image', async () => {
  const blogData = {
    category: "Experience",
    author: "Sammy",
    title: 'Test Blog Title',
    description: 'This is a test blog description.',
  };

  const responsez = await request(app)
    .post('/api/v1/blogs')
    .set('Authorization', `Bearer ${token}`)
    .field('category', blogData.category)
    .field('author', blogData.author)
    .field('title', blogData.title)
    .field('description', blogData.description)
    .expect(400)
  expect(responsez.body).toHaveProperty('message', "Please provide an image file");
});

// delete a blog
test('it should return 204 id blog is deleted', async () =>{
  const deleteBlog = await request(app)
  .delete(`/api/v1/blogs/${id}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(204)
})

// get a single user test
test('it should return 200 and single user details', async () =>{
  const user = await request(app)
  .get(`/api/v1/users/${userId}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
})
// get a single user who is not available
test('it should return 404 when user not found', async () =>{
  const user = await request(app)
  .get(`/api/v1/users/65f465abd1370247463b3952`)
  .set('Authorization', `Bearer ${token}`)
  .expect(404)
})

test('it should return 200 when user updated successfully', async () =>{
  const updatingData = {
    names: 'updated user',
    email: 'updated@gmail.com',
    password: 'updated@123',
    role: 'admin'
  };
  
  const user = await request(app)  
    .patch(`/api/v1/users/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatingData)
    .expect(200); 

});



// update a single user who is not available
test('it should return 404 when user to be updated is not found', async () =>{
  const user = await request(app)
  .patch(`/api/v1/users/65f465abd1370942463b3952`)
  .set('Authorization', `Bearer ${token}`)
  .expect(404)
})

test('it should return 201 when a querry is created', async () =>{
  const querryData = {
      fullNames: "IZANYIBUKA",
      email: "izanyibukayvette1@gmail.com",
      subject: "fourth querry subject",
      message: "fourth querry message"
  }
  const response = await request(app)
  .post("/api/v1/querries")
  .send(querryData)
  .expect(201);
  querryId = response.body;
})
test('it should return 500 when there is undocumented error in a query creation', async () => {
  const querryData = {
    fullNames: "IZANYIBUKA",
    email: "izanyibukayvette1@gmail.com",
    subject: "fourth query subject",
    message: "fourth query message"
  };

  jest.spyOn(QuerrySchema.prototype, 'save').mockImplementationOnce(() => {
    throw new Error('Unexpected error during query creation');
  });

  const response = await request(app)
    .post("/api/v1/querries")
    .send(querryData)
    .expect(500);
  expect(response.body).toEqual({ message: 'Internal server error' });
});


//get all queries
test('it should return 200 and the list of queries', async () =>{

  const response = await request(app)
  .get("/api/v1/querries")
  .set('Authorization', `Bearer ${token}`)
  .expect(200);
})

// get a single querry test
test('it should return 200 and single querry details', async () =>{
  const querry = await request(app)
  .get(`/api/v1/querries`)
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
})
// get a single querry which is not available
test('it should return 404 when querry not found', async () =>{
  const user = await request(app)
  .get(`/api/v1/querries/65f465abd1370247463b3952`)
  .set('Authorization', `Bearer ${token}`)
  .expect(404)
})
test('it should return 500 when there is an error in getting a single query', async () => {
  jest.spyOn(QuerrySchema, 'findOne').mockImplementationOnce(() => {
    throw new Error('Unexpected error while fetching query');
  });
  const response = await request(app)
    .get(`/api/v1/querries/65f465abd1370247463b3952`)
    .set('Authorization', `Bearer ${token}`)
    .expect(500);
     expect(response.status).toBe(500);
});

});
});


