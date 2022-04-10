import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import ws from "./websocket/socket";
ws.createWebSocket();
console.log("load");

createApp(App).use(router).mount("#app");
