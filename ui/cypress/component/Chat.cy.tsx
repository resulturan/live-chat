import Chat from "../../src/Chat";
import React from "react";
import { initServer } from "./server";
import { WebSocket } from "mock-socket";

describe("Chat.cy.tsx", () => {
    it("Mount Messages", () => {
        cy.viewport(1000, 1000);

        initServer();

        cy.stub(window, "WebSocket").callsFake(url => {
            return new WebSocket(url);
        });

        localStorage.setItem("username", "Resul");
        cy.intercept(
            {
                method: "GET",
                url: "/api/message",
            },
            {
                data: exampleMessageList,
            }
        ).as("getMessages");

        cy.intercept(
            {
                method: "POST",
                url: "/api/profile/get-or-create",
            },
            {
                data: {
                    id: crypto.randomUUID(),
                    username: "Resul",
                },
            }
        ).as("getOrCreateUser");

        cy.mount(<Chat />).then(() => {
            cy.get("#new-message-input").type("Test message");
            cy.get("#new-message-button").click();

            cy.get("#new-message-input").should("have.value", "");
        });
    });
});

const exampleMessageList = [
    {
        id: crypto.randomUUID(),
        text: "Hello, how are you?",
        senderId: "67f14ba0984c49cc841b365f",
        createdAt: "2025-04-05T15:32:26.629Z",
        user: {
            username: "Resul",
            createdAt: "2025-04-05T15:26:24.234Z",
            updatedAt: "2025-04-05T15:26:24.234Z",
        },
    },
    {
        id: crypto.randomUUID(),
        text: "I'm great! What are you doing?",
        senderId: "67f16f5793fd761180bee28e",
        createdAt: "2025-04-05T15:42:02.696Z",
        user: {
            username: "İsa",
            createdAt: "2025-04-05T15:26:24.234Z",
            updatedAt: "2025-04-05T15:26:24.234Z",
        },
    },
    {
        id: crypto.randomUUID(),
        text: "I'm just checking in. How about you?",
        senderId: "67f14ba0984c49cc841b365f",
        createdAt: "2025-04-05T15:47:20.918Z",
        user: {
            username: "Resul",
            createdAt: "2025-04-05T15:26:24.234Z",
            updatedAt: "2025-04-05T15:26:24.234Z",
        },
    },
    {
        id: crypto.randomUUID(),
        text: "Me too. I'm just waiting for the results.",
        senderId: "67f16f5793fd761180bee28e",
        createdAt: "2025-04-05T15:47:22.103Z",
        user: {
            username: "İsa",
            createdAt: "2025-04-05T15:26:24.234Z",
            updatedAt: "2025-04-05T15:26:24.234Z",
        },
    },
    {
        id: crypto.randomUUID(),
        text: "What time will you be there?",
        senderId: "67f14ba0984c49cc841b365f",
        createdAt: "2025-04-05T15:47:40.456Z",
        user: {
            username: "Resul",
            createdAt: "2025-04-05T15:26:24.234Z",
            updatedAt: "2025-04-05T15:26:24.234Z",
        },
    },
    {
        id: crypto.randomUUID(),
        text: "I'm not sure yet. I'll let you know later.",
        senderId: "67f16f5793fd761180bee28e",
        createdAt: "2025-04-05T15:50:01.031Z",
        user: {
            username: "İsa",
            createdAt: "2025-04-05T15:26:24.234Z",
            updatedAt: "2025-04-05T15:26:24.234Z",
        },
    },
];
