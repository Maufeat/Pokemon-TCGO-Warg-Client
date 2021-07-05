# Pokemon TCGO Warg Client

This is a simple TCP client to connect to the Pokemon TCGO server and check codes via an API.

## Installation

Just install node, `typescript` and `@types/node` and run with the `dev` script or `node src/app.js`

## Problem

This project, as it is right now, can't connect with an existing account. It connects always as a guest but automatically reconnects with another random guest account.

## Usage

Change the client version in `Constants.ts` to be able to connect.

In `TCGOApp.ts` change the certificate (it's self-signed) or change from `TLS` to `Net` for a non-secure connection on localhost.

## Help
If you need help, just open an issue with your problem and I'll try to help as much as I can.
