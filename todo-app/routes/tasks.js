// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const router = require('express-promise-router')();
const graph = require('../graph.js');
const path = require('path');
// module to read and write Excel files
const xlsx = require('xlsx');

// <GetRouteSnippet>
/* GET /tasks */
router.get('/',
  async function(req, res) {
    if (!req.session.userId) {
      // Redirect unauthenticated requests to home page
      res.redirect('/auth/signin')
    } else {
      const params = {};

      // Get the user
      const user = req.app.locals.users[req.session.userId];
      
      try {
        // Get the events
        const events = await graph.getTaskView(
          req.app.locals.msalClient,
          req.session.userId);

        // Assign the events to the view parameters
        params.events = events.value;
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not fetch events',
          debug: JSON.stringify(err, Object.getOwnPropertyNames(err))
        });
      }

      // console.log(params);
      res.render('tasks.ejs', { tasklists: params.events});
    }
  }
);
// </GetRouteSnippet>

/* GET /tasks/import/download */
router.get('/import/download', async (req, res) => {
  if (!req.session.userId) {
    // Redirect unauthenticated requests to home page
    res.redirect('/auth/signin')
  } else {
    // Get the user
    const user = req.app.locals.users[req.session.userId];
    const fileName = 'ImportTemplate.xlsx';
    const filePath = path.resolve(__dirname, '../public/ImportTemplate.xlsx');
    // console.log(filePath);
    res.download(filePath);
  }
})

/* GET /tasks/import */
router.get('/import', async (req, res) => {
  if (!req.session.userId) {
    // Redirect unauthenticated requests to home page
    res.redirect('/auth/signin')
  } else {
    const params = {};

    // Get the user
    const user = req.app.locals.users[req.session.userId];

    // console.log(params);
    res.render('import.ejs');
  }
})

/* POST /tasks/new */
router.post('/new', async (req, res) => {
  if (!req.session.userId) {
    // Redirect unauthenticated requests to home page
    res.redirect('/auth/signin')
  } else {
    // if (req.files) {
    //   console.log(req.files);
    // }
    // Build an object from the form values
    const formData = {
      taskList: req.body['taskList'],
      importFile: req.files['importFile']
    };
    const importFileName = formData.importFile.name;

    formData.importFile.mv('./public/uploads/' + importFileName, (err) => {
      if (err) {
        console.log("Error while uploading file:");
        console.log(err);
      } else {
        res.redirect('/tasks');
      }
    })

    // reading the excel file uploaded
    const file = xlsx.readFile('./public/uploads/' + importFileName);
    // const data = [];

    const sheets = file.SheetNames;

    const data = xlsx.utils.sheet_to_json(file.Sheets[sheets[0]]);

    // temp.forEach(res => {
    //   data.push(res);
    // });

    // Get the user
    // const user = req.app.locals.users[req.session.userId];

    console.log(data);
    // res.render('import.ejs');
  }
})


// <GetRouteSnippet>
/* GET /tasks/:id */
router.get('/:id', async (req, res) => {
    if (!req.session.userId) {
      // Redirect unauthenticated requests to home page
      res.redirect('/auth/signin')
    } else {
      const params = {};

      // Get the user
      const user = req.app.locals.users[req.session.userId];
      
      try {
        // console.log(req.params.id);
        // Get the events
        const events = await graph.getTaskListView(
          req.app.locals.msalClient,
          req.session.userId,
          req.params.id);
        // console.log(params);
        // Assign the events to the view parameters
        params.events = events.value;
        // console.log(params);
      } catch (err) {
        req.flash('error_msg', {
          message: 'Could not fetch events',
          debug: JSON.stringify(err, Object.getOwnPropertyNames(err))
        });
      }
      // console.log(params.events);
      res.render('show.ejs', { toDoTasklists: params.events });
    }
  }
);
// </GetRouteSnippet>

module.exports = router;
