# create-react-app with a Node server on Heroku

A minimal example of using a Node backend (server for API, proxy, & routing) with a [React frontend](https://github.com/facebookincubator/create-react-app).

To deploy a frontend-only React app, use the static-site optimized  
▶️ [create-react-app-buildpack](https://github.com/mars/create-react-app-buildpack)

⤵️ [Switching from create-react-app-buildpack](#switching-from-create-react-app-buildpack)?


## Design Points

A combo of two npm projects, the backend server and the frontend UI. So there are two `package.json` configs and thereforce two places to run `npm` commands:

  1. [`package.json`](package.json) for [Node server](server/) & [Heroku deploy](https://devcenter.heroku.com/categories/deployment)
      * `heroku-postbuild` script compiles the webpack bundle during deploy
