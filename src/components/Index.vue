<script setup lang="ts">
import { onMounted } from "vue";
import socket, { Ws } from "../websocket/socket.ts";

onMounted(() => {
  setTimeout(() => {
    socket.send("100");
  }, 500);

  Ws.getInstance()
    .then((ws) => {
      ws.onmessage = (event) => {
        console.log("ws 接收到消息", event.data);
      };
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>

<template>Index</template>
