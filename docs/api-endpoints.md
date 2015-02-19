# API Endpoints

To access the APIs in Angular, use the following injectable constants from `flannel.config`:

* Utilities: 
  * GET:
  ```
    $http({
      url: UTILITIES_API,
      params: {
        city: 'West Windsor',
        zip: '08550'
      }
    })
  ```

* Warehouse:  
  * GET:
  ```
    $http({
      url: WAREHOUSE_API,
      params: {
        zip: '08550'
      }
    })
  ```

* Rates:
  * GET:
  ```
    $http({
      url: RATES_API,
      params: {
        utilityid: 3
      }
    })
  ```

* Credit check:  
  * POST:
  ```
    $http({
      url: CREDIT_CHECK_API,
      method: 'POST',
      data: {
        Contactid: '805944',
        AddressId: '24533',
        BirthDate: '03/05/1983'
      }
    })
  ```

* Contact create:
  * POST:
  ```
    $http({
      url: CONTACT_API,
      method: 'POST',
      data: {
        Email: 'sumanaApi2@gmail.com',
        FirstName: 'Sergio',
        LastName: 'Umana',
        PhoneNumber: '5551231234',
        Address: {
          AddressLine1: '22 Galileo Drive',
          AddressLine2: '',
          City: 'Cranbury',
          State: 'NJ',
          Zip: '08512',
          Country: 'US',
          Latitude: '40.3853195',
          Longitude: '-74.5787935'
        }
      }
    })
  ```

* Near me: 
  * GET: 
  ```
    $http({
      url: NEAR_ME_API,
      params: {
        id: 'aae17a3d-d36a-4403-8619-1e3fd453edb7'
      }
    })
  ```

* Scheduling: 
  * GET:
  ```
    $http({
      url: GSA_API,
      params: {
        contractGUID: '12345'
      }
    })
  ```