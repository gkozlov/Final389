

### Overview

This is a "crowdsourced vacation application".

It utilizes (HTML, CSS, JS, Node.js, Express, and Handlebars) to create an API and front-end website with interactivity for the data.

### Objectives

The project uses MongoDB with two different schemas located in data_schema.js

The sockets are incorporated via the create endpoint. When you add another destination it automatically shows up in the app.

Handlebars is genrating multiple pages plus the desciprion page.


### API Endpoints

1. **/**
    - This is a home endpoint that displays all of the destinations currently in the database
2. **/api/getDestinations**
    - Displays all of the destinations as JSON objects
3. **/closest**
    - Displays all of the destinations within 1001-1002 (uses a RNG to decide) miles from College Park
4. **/least**
    - Displays the least crowded destination from the list (based on # of average visitors per year)
5. **/far**
    - Displays the destination that is furthest away from College Park, MD
6. **/most**
    - Displays the destination(s) with the most Ameneties 
7. **/alphabetical**
    - Displays the destinations in ASCII alpahbetical order
8. **/create**
    - This takes you to the create page
9. **/api/create**
    - This is a POST request that creates the entered destination and stores it in the MONGO database
10. **/dest/:city/:tags**
    - This is a POST request that adds an Amenity to a specific City
11. **/city/:id**
    - This is a DELETE endpoint that will delete the specified city from the list/database
12. **/country/:id**
    - This is a DELETE endpoint that will delete a FIRST instance of the country from the list/database
13. **/description**
    - Basic desciption page

### Additional Modules

closestController.js - This module converts our distance into a float

### NPM Packages
 Using two new packages:
 1.  lodash: used throughout the project
 2.  make-random: use it in /closest endpoint to generate a random number between 1001-1002
 






   