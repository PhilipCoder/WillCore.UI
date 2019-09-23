import { willCore, url, route, layout } from "./willCore/WillCore.js";
//Login page
willCore.loginPage = [willCore.$loginViewContainer, url, "/stockManaging/loginPage/view.js", url, "/stockManaging/loginPage/view.html", route, "/", x => true];
//main view layout
willCore.mainLayout = [layout, "/stockManaging/layouts/navbarLayout.js", "/stockManaging/layouts/navbarLayout.html"];
//Category views
willCore.allCategories = [willCore.mainLayout.$mainContentDiv, url, "/stockManaging/categories/viewAll.js", url, "/stockManaging/categories/viewAll.html", route, "/categories", x => true, willCore.mainLayout];
willCore.addCategory = [willCore.mainLayout.$mainContentDiv, url, "/stockManaging/categories/add.js", url, "/stockManaging/categories/add.html", route, "/addcategory", x => true, willCore.mainLayout];
willCore.info = [willCore.mainLayout.$mainContentDiv, url, "/stockManaging/categories/info.js", url, "/stockManaging/categories/info.html", route, "/info", x => true, willCore.mainLayout];

willCore("/");

//willCore.view = [willCore.$elementID, url, "/stockManaging/loginPage/view.js", url, "/stockManaging/loginPage/view.html", route,"/", x=>true];