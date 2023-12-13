"use strict";

const uuid = require("uuid");

const issues = [];

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;

      const toReturn = issues.filter((x) => {
        let flag = project === x.project;

        for (const key in req.query) {
          flag = flag && x[key] == req.query[key];
        }

        return flag;
      });

      res.json(toReturn);
      return;
    })

    .post(function (req, res) {
      let project = req.params.project;

      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      const created_on = new Date();
      const updated_on = created_on;

      if (!issue_title || !issue_text || !created_by) {
        res.json({
          error: "required field(s) missing",
        });
        return;
      }

      const issue = {
        _id: uuid.v4(),
        issue_title,
        issue_text,
        created_on,
        updated_on,
        created_by,
        assigned_to: assigned_to ?? "",
        open: true,
        status_text: status_text ?? "",
      };

      res.json(issue);
      issue.project = project;
      issues.push(issue);
    })

    .put(function (req, res) {
      let project = req.params.project;

      const _id = req.body._id;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }

      if (Object.keys(req.body).length == 1) {
        res.json({ error: "no update field(s) sent", _id });
        return;
      }

      try {
        const index = issues.findIndex(
          (x) => x.project === project && x._id == _id
        );
        console.log("before " + issues[index].toString());
        console.log("request =" + req.body);
        issues[index] = { ...issues[index], ...req.body };
        issues[index].updated_on = new Date();
        console.log("after =" + issues[index].toString());
        res.json({ result: "successfully updated", _id });
      } catch (e) {
        res.json({ error: "could not update", _id });
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const _id = req.body._id;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }

      const index = issues.findIndex(
        (x) => x.project === project && x._id == _id
      );
      if (index == -1) {
        res.json({ error: "could not delete", _id: _id });
      } else {
        issues.splice(index, 1);
        res.send({ result: "successfully deleted", _id: _id });
      }
    });
};
