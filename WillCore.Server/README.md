# WillCore.Server
### Todo
* Editor view load logic
  * Simple editor 
  * Register editor views according to their config in a global container.
  * Editor view assigner.
  * View editor.
    * Module side nav component, load nav links from plugin.
  * Component editor

### Overview
The idea is to be able to add sheets and linked sheets that is backed by a MySQL DB. 

The DataBase engine will use sequelize under the hood. A new server-side willCore proxy will have to be created.

Defining a database connection:
```javascript
//index.server.js
//NB the willCore proxy will have to be a new proxy instance for every request for db functionality
//Todo: front-end should also use the parameters instead of globals
module.exports = (view, willCore, assignables) => {
    willCore.myDB = [assignables.mysql, "username","password"];
    //or
    willCore.myDB.assignables.mysql = ["username","password"];
};
```

Defining a table:
```javascript
module.exports = (view, willCore, assignables) => {
    //Create DB
    willCore.myDB.mysql = [assignables.mysql, "username","password"];
    //Create table
    willCore.myDB.owners.table;
    willCore.myDB.owners.name.string;
    willCore.myDB.owners.auditDate.date;
    //default value
    willCore.myDB.dogs.auditDate = () => new Date();
    //Create table
    willCore.myDB.dogs.table;
    willCore.myDB.dogs.name.string;
    willCore.myDB.dogs.age.int;
    //Foreign key (one)
    willCore.myDB.dogs.owner = willCore.myDB.owners;
    //Foreign key (many)
    willCore.myDB.dogs["*owners"] = willCore.myDB.owners;
    //Updates the db
    await willCore.myDB();
    
    //Selects a single instance, returns a proxy.
    willCore.myDB.dogs = 20;
    let myDog = await willCore.myDB.dogs;
    //Updates the dog.
    myDog.name = "Beast";
    await myDog();

    //Selects a multiple instances
    willCore.myDB.dogs = [20,21,23];
    let myDogs = await willCore.myDB.dogs;

    //Selects a dog where owner is Philip
    willCore.myDB.dogs = (name = name, owner = owner.name) => dogs.age > 90 && owner.name === "Philip";
    let result = await willCore.myDB.dogs;

    //Selects a dog where owner is Philip and the owner count. Default is inner join
    willCore.myDB.dogs = (name = dogs.name, ownerCount = count(dogs.owner.name)) => dogs.age > 90 && dogs.owner.name === "Philip";
    let result = await willCore.myDB.dogs;

    //Using a right join: >. Left join is <
    willCore.myDB.dogs = (name = dogs.name, ownerCount = count(dogs[">"].owner.name)) => dogs.age > 90 && dogs[">"].owner.name === "Philip";
    let result = await willCore.myDB.dogs;

};
```