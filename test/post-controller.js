const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const request = require('supertest');
const app = require('../app');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY2ZWRjODlkOGNmMTkwMWZjODc2NWI3NCIsImVtYWlsIjoidXNtYW4uY29kZUBnbWFpbC5jb20ifSwiaWF0IjoxNzI2OTIzMTc2fQ.hBMishOzvEwDBrAz7snopeNrXJN44QPu7tkMnBYSLso';

//using supertest, chai, mocha
describe('Post Controller Testing', () => {

    it('Invalid Token issue.', (done) => {
        request(app)
            .post('/admin/create-post')
            .set('Accept', 'application/json')
            .set("Authorization", "Bearer 123ds")
            .field('title', 'title 1')
            .field('description', 'des 1')
            .attach('image', path.join(__dirname, 'test-file.txt')) // path to a test file
            .expect('Content-Type', /json/)
            .expect(401)
            .then((res) => {
                // statusCode===401
                // statusMessage==='Unauthorized'
                // type==='application/json'
                // console.log('____________', res, res.body
                // res.type, res.text, res.error.status, res.res.text, JSON.parse(res.error.text).message, 
                // res.error.message, res.res.statusMessage
                // );
                // console.log(res.body);
                expect(res).to.have.property('statusCode', 401);
                expect(res.body).to.have.property('message', 'jwt malformed');
                done();
            });
    });

    it('Token missing issue.', (done) => {
        request(app)
            .post('/admin/create-post')
            .set('Accept', 'application/json')
            .field('title', 'title 1')
            .field('description', 'des 1')
            .attach('image', path.join(__dirname, 'test-file.txt')) // path to a test file
            .expect('Content-Type', /json/)
            .expect(401)
            .then((res) => {
                expect(res).to.have.property('statusCode', 401);
                expect(res.body).to.have.property('message', 'Token is required.');
                done();
            });
    });

    it('During post creation, form validation issue.', (done) => {
        request(app)
            .post('/admin/create-post')
            .set('Accept', 'application/json')
            .set("Authorization", `Bearer ${TOKEN}`)
            // .field('title', 'title 1')
            // .field('description', 'des 1')
            // .attach('image', path.join(__dirname, 'test-file.txt')) // path to a test file
            .expect('Content-Type', /json/)
            .expect(500)
            .then((res) => {
                expect(res.body).to.have.property('message', 'There is some error.');
                expect(res.body).to.have.property('formError');
                done();
            });
    });

    it('Post is created successfully', (done) => {
        request(app)
            .post('/admin/create-post')
            .set("Authorization", `Bearer ${TOKEN}`)
            .field('title', 'title 1')
            .field('description', 'des 1')
            .attach('image', path.join(__dirname, 'test-file.txt')) // path to a test file
            .expect('Content-Type', /json/)
            .expect(201)
            .then((res) => {
                expect(res).to.have.property('statusCode', 201);
                expect(res.body).to.have.property('message', 'Post is created successfully.');
                const uploadedFilePath = `${res.body.post.image}`;
                // console.log('__ß', uploadedFilePath, fs.existsSync(uploadedFilePath))
                if (fs.existsSync(uploadedFilePath)) {
                    fs.unlinkSync(uploadedFilePath);
                }
                done();
            });
    });

    it('Post does not exist.', (done) => {
        request(app)
            .post('/admin/edit-post/66edcaf1db117d47ea1bf851')
            .set("Authorization", `Bearer ${TOKEN}`)
            .field('title', 'title 1')
            .field('description', 'des 1')
            // .attach('image', path.join(__dirname, 'test-file.txt')) // path to a test file
            .expect('Content-Type', /json/)
            .expect(500)
            .then((res) => {
                // console.log('res.body___', res.body);
                expect(JSON.parse(res.text)).to.have.property('message', 'Post does not exist.');
                done();
            });
    });

    it("During post edit, form validation issue.", (done) => {
        request(app)
            .post('/admin/edit-post/66f42410cbcf6a11752c68ac')
            .set("Authorization", `Bearer ${TOKEN}`)
            // .field('title', 'title 2')
            .expect('Content-Type', /json/)
            .expect(500)
            .then((res) => {
                expect(res.body).to.have.property('message', 'There is some error.');
                done();
            });
    });

    it("Post is edit successfully", (done) => {
        request(app)
            .post('/admin/edit-post/66f42410cbcf6a11752c68ac')
            .set("Authorization", `Bearer ${TOKEN}`)
            .field('title', 'title 3')
            .field('description', 'des 3')
            // .attach('image', path.join(__dirname, 'test-file.txt')) // path to a test file
            .expect('Content-Type', /json/)
            // .expect(200)
            .then((res) => {
                // console.log(res.body);
                expect(res.body).to.have.property('message', 'Post is updated successfully.');
                expect(res.body).to.have.property('post');
                const uploadedFilePath = `${res.body.post.image}`;
                console.log('fs.existsSync(uploadedFilePath)__', fs.existsSync(uploadedFilePath));
                // if (fs.existsSync(uploadedFilePath)) {
                //     fs.unlinkSync(uploadedFilePath);
                // }
                done();
            });
    });

});