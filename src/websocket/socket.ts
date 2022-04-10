import EventEmitter from "events"; // 这里用到了 events 包
const ee = new EventEmitter();

export class Ws {
  private wsUrl: string = "";
  private static instance: WebSocket | undefined; // socket实例
  private lockReconnect: boolean = false; // 重连锁
  private timeout: NodeJS.Timeout | undefined;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  public send(str: string) {
    Ws.instance?.send(str);
  }

  // 获取socket实例
  static getInstance(): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      if (Ws.instance) {
        console.log("init", Ws.instance);
        resolve(Ws.instance);
      } else {
        ee.on("socket", (state: string) => {
          if (state === "success") {
            resolve(Ws.instance as WebSocket);
          } else {
            reject();
          }
        });
      }
    });
  }

  // 创建socket
  public createWebSocket() {
    try {
      console.log("websocket 开始链接");
      const socket = new WebSocket(this.wsUrl);
      socket.addEventListener("close", () => {
        console.log("websocket 链接关闭");
        Ws.instance = undefined;
        this.reconnect();
      });
      socket.addEventListener("error", () => {
        console.log("websocket 发生异常了");
        Ws.instance = undefined;
        this.reconnect();
      });
      socket.addEventListener("open", () => {
        // 可在此进行心跳检测
        // this.heartCheck.start();
        console.log("websocket open");
        Ws.instance = socket;
        ee.emit("socket", "success");
      });
      socket.addEventListener("message", (event) => {
        // console.log("websocket 接收到消息", event);
      });
    } catch (e) {
      console.log("socket catch error", e);
      this.reconnect();
    }
  }

  // 重连
  private reconnect() {
    if (this.lockReconnect) {
      return;
    }
    console.log("websocket 正在重新连接");
    this.lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    this.timeout && clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, 5000);
  }
}

export default new Ws("ws://localhost:8080");
