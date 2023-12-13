const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let id;

suite("Functional Tests", function () {
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Every field filled in",
        assigned_to: "Chai and Mocha",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(
          res.body.created_by,
          "Functional Test - Every field filled in"
        );
        assert.equal(res.body.assigned_to, "Chai and Mocha");
        assert.equal(res.body.status_text, "In QA");
        done();
      });
  });

  test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "text",
        created_by: "Functional Test - Only required fields filled in",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(
          res.body.created_by,
          "Functional Test - Only required fields filled in"
        );
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        done();
      });
  });

  test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "text",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

    test("View issues on a project: GET request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .get("/api/issues/test")
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            id = res.body[0]._id;
            done();
        });
    });

    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .get("/api/issues/test")
        .query({open: true})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
        });
    });

    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .get("/api/issues/test")
        .query({open: true, created_by: "Functional Test - Every field filled in"})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
        });
    });

    test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({_id: id, issue_title: "New Title"})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            done();
        });
    });

    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({_id: id, issue_title: "New Title", issue_text: "New Text"})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            done();
        });
    });

    test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({issue_title: "New Title", issue_text: "New Text"})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
        });
    });
        
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({_id: id})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");
            done();
        });
    });

    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .put("/api/issues/test")
        .send({_id: "ewrwg2", issue_title: "New Title"})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");
            done();
        });
    });

    test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .delete("/api/issues/test")
        .send({_id: id})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            done();
        });
    });

    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .delete("/api/issues/test")
        .send({_id: "60c2e6d4b2b7f60015c3d3c9"})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");
            done();
        });
    });

    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
        chai
        .request(server)
        .delete("/api/issues/test")
        .end((err, res) => {
            
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
        });
    });



});
