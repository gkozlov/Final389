
# PROJECT NAME

---

Name: George Kozlov

Date: 04/10/2020

Project Topic: Crowdsourced website of vacation destinations

URL: 

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     City           `Type: String`
- `Field 2`:     Country        `Type: String`
- `Field 3`:     Distance       `Type: String`
- `Field 4`:     Visitors       `Type: Number`
- `Field 5`:     Tags           `Type: [String]`

Schema: 
```javascript
{
    city: String,
    country: String,
    distance: String, 
    visitors: Number,
    tags: [amen]
}
{
    amen: String
}
```

### 2. Add New Data

HTML form route: `/create`

POST endpoint route: `/api/create`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/...',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        city: 'Cusco', 
        country: 'Peru',
        distance: "4000 mi",
        visitors: 35000000,
        tags: ["Hiking","Natural Sights","History","Archaeological Remains"]
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/getDestinations`

### 4. Search Data

Search Field: On city name

### 5. Navigation Pages

Navigation Filters
1. All Destinations within 1000 mile radius from DC -> `/closest`
2. Most Amenities -> `/most`
3. Least number of annual visitors/Least Crowded -> `/least`
4. Alphabetical listing by city -> `/alphabetical`
5. Furthest away from DC -> `/far`

