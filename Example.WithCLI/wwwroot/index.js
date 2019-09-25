import { willCore, url, route, layout } from "./willCore/WillCore.js";

willCore.home = [willCore.$mainContentDiv, url, "/home.js", url, "/home.html", route, "/", x => true];

willCore("/");