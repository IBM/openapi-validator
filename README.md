# Swagger-Editor-IBM

Swagger Editor lets you edit [Swagger API specifications](https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md) in YAML inside your browser and to preview documentations in real time.
This version of the swagger editor adds custom validations based on finds and guidelines working with SDK generation team.  

Here is the squad info plus information around SDK and API reference generation [sdk-squad](https://pages.github.ibm.com/arf/planning-sdk-squad/)

## Running locally

To run a local instance with validation and hot-reload funcationlity then invoke `npm run dev`. 

To run the tests then invoke `npm run test`. 

##### Prerequisites
- Node 6.x
- NPM 3.x

If you have Node.js and npm installed, you can run `npm start` to spin up a static server.

Otherwise, you can open `index.html` directly from your filesystem in your browser.

Note: At this time, if the editor is opened using `npm start` or `index.html`, the validations will __not__ be run.

If you'd like to make code changes to Swagger-Editor, you can start up a Webpack hot-reloading dev server via `npm run dev`. 

##### Browser support

Swagger UI works in the latest versions of Chrome, Safari, Firefox, Edge and IE11.


## License

Copyright 2017 SmartBear Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
