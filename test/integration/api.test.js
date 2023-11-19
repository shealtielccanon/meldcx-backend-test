const request = require('supertest');
const fs = require('fs');
const app = require('../../src/index');
const expect = require('chai').expect;
const path = require('path');

describe('File Server API Integration Tests', () => {
  it('should upload files', async () => {
    const filePath = path.join('test-upload.jpg');
    const fileData = fs.readFileSync(filePath);

    const res = await request(app).post('/files').attach('file', fileData, 'test-upload.jpg');

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('publicKey');
    expect(res.body).to.have.property('privateKey');
  });

  it('should retrieve files', async () => {
    const testPublicKey = 'testPublicKey'

    const res = await request(app).get(`/files/${testPublicKey}`);

    expect(res.status).to.equal(200);
    // expect(res.body).to.have.property('message', 'Files downloaded');    
  });

  it('should delete files', async () => {
    const testPrivateKey = 'testPrivateKey'
    const res = await request(app).delete(`/files/${testPrivateKey}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Files deleted');
  });
});
