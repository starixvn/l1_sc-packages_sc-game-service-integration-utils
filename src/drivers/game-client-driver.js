import { io } from "socket.io-client";

export const eventTypes = {
    signedIn: "signedIn",
    connect: "connect",
    signIn: "signin",
    reconnect: "reconnect",
    connectFailed: "connect_failed",
    connectError: "connect_error",
    disconnect: "disconnect",
    bet: "bet",
    getHistory: "getHistory",
    inGame: "inGame",
    message: "message",
    forceDisconnect: "forceDisconnect",
    getGameConfigs: "getGameConfigs",
    getStatistics: "getStatistics",
};

const WAITING_PLACE_BET_TIMEOUT = 10000;

export class GameClientDriver {
    socket;
    gameName;
    onConnectFailed;
    userSession;

    constructor(socketOptions, userSession) {
        this.socket = io(socketOptions.socketUri, {
            transports: ["websocket"],
            upgrade: false,
            path: socketOptions.proxyRoute,
            forceNew: true,
            extraHeaders: {
                "user-agent": userSession.browserUserAgent,
            },
        });
        this.gameName = socketOptions.gameName;
        this.onConnectFailed = socketOptions.onConnectFailed || (() => ({}));
        this.userSession = userSession;
        this.registerEvents();
    }

    getSocketClient() {
        return this.socket;
    }

    close() {
        this.socket && this.socket.disconnect();
    }

    handleSignedInEvent(eventHandler) {
        this.on(eventTypes.signedIn, eventHandler);
    }

    handleInGameEvent(eventHandler) {
        this.on(this.gameName, eventHandler);
    }

    handleEndBetEvent(eventHandler) {
        this.on(this.gameName, eventHandler);
    }

    handleGetHistoryEvent(eventHandler) {
        this.on(this.gameName, eventHandler);
    }

    handleEndGameEvent(eventHandler) {
        this.on(this.gameName, eventHandler);
    }

    on(eventName, eventHandler) {
        this.socket.on(eventName, eventHandler);
    }

    off(eventName) {
        this.socket.off(eventName);
    }

    once(eventName, eventHandler) {
        this.socket.once(eventName, eventHandler);
    }

    removeListener(eventName, handler) {
        this.socket.removeListener(eventName, handler);
    }

    sendSignInEvent() {
        this.emit(eventTypes.signIn, this.userSession);
    }

    sendInGameEvent() {
        this.emit(eventTypes.inGame);
    }

    sendGetHistoryEvent(page = 1) {
        this.emit(eventTypes.getHistory, { page });
    }

    sendBetEvent(betChoice, amount) {
        this.emit(eventTypes.bet, { betChoice, amount });
    }

    emit(eventName, ...args) {
        if (args.length) {
            this.socket.emit(eventName, ...args);
        } else {
            this.socket.emit(eventName);
        }
    }

    registerEvents() {
        this.on(eventTypes.connect, () => {
            this.sendSignInEvent();
        });

        this.on(eventTypes.reconnect, () => {
            console.error(this.buildLog(eventTypes.reconnect));
        });

        this.on(eventTypes.connectFailed, () => {
            console.error(this.buildLog(eventTypes.connectFailed));
            this.socket.disconnect();
            this.onConnectFailed(this.gameName);
        });

        this.on(eventTypes.connectError, (error) => {
            console.error(error);
            this.socket.disconnect();
            this.onConnectFailed(this.gameName);
        });

        this.on(eventTypes.disconnect, (reason) => {
            console.log(this.buildLog(eventTypes.disconnect, reason));
        });
    }

    buildLog(event, message) {
        return JSON.stringify({
            event,
            message,
            game: this.gameName,
        });
    }
}
