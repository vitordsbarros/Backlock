# Backlock

**Backlock** is a 100% terminal-based private messaging environment built with Node.js. Focused on privacy and security, the project adopts a *Stateless* architecture and end-to-end encrypted communication, ideal for those seeking an ephemeral and secure chat room.

---

## Features

* **100% Stateless (Ephemeral):** No database. The server keeps clients and messages in memory only. When the server shuts down, all history disappears forever.
* **Security and Encryption (TLS):** All communication flows through a secure tunnel. SSL/TLS certificates are automatically generated (`selfsigned`) on the first run, without relying on external installations like OpenSSL.
* **Authentication with Argon2:** Access credentials are generated locally in a vault (`access.vault`) and protected by the Argon2 hashing algorithm, one of the most secure available today.
* **Visual Privacy:** Dynamic password masking in the terminal (`*`), ensuring credentials are not exposed on the screen, complying with privacy best practices.
* **Smart Resource Management:** The server has an autonomous *lifecycle*. If the room becomes empty, a timer starts, and the server shuts itself down to save the host machine's memory.
* **Custom CLI Design:** Rich and fluid terminal interface built with `chalk`, `boxen`, `ora`, and `figlet`.

---

## Project Structure

The code is modularized to cleanly separate responsibilities:

```text
Backlock/
├── admin/          # Isolated CLI for generating passwords and local certificates
├── client/         # Graphical terminal interface and user connection
├── server/         # Routing engine, authentication, and lifecycle control
├── data/           # (Ignored in Git) Stores access.vault and the certs/ folder
├── shared/         # (Optional) Shared code between client and server
└── .env            # Environment configurations (Port, Timeout)
```

---

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* Standard system terminal or terminal emulator (like Termux for Android)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone [https://github.com/vitordsbarros/Backlock.git](https://github.com/vitordsbarros/Backlock.git)
cd Backlock
npm install
```

### 2. Access Vault Creation (Admin)
Before starting the server, you need to define who can access it. The system has no default generic credentials.
Run the command below and follow the on-screen instructions to create a username and password:
```bash
node admin/vaultManager.js
```
*This will securely generate the `data/access.vault` file.*

### 3. Starting the Server
You can use the `.bat` file for convenience on Windows, or run the npm command:
```bash
# Via .bat file
start-server.bat

# Or via terminal
npm run server
```
*On the first run, security certificates will be generated automatically.*

### 4. Connecting to the Chat (Client)
Open another terminal window (or on another device on the same network/tunnel) and start the client:
```bash
# Via .bat file
start-client.bat

# Or via terminal
npm run client
```
Enter the Host (`localhost` for the same machine or the server's IP/Ngrok), the port (default `8080`), and the credentials created in Step 2.

---

## Environment Variables (.env)

Create a `.env` file in the root of the project (if it doesn't exist) to customize the server's behavior:

```env
# Port where the TLS server will run
PORT=8080

# Time in milliseconds for the server to shut down if empty (e.g., 300000 = 5 min)
IDLE_TIMEOUT=300000
```

---

## Chat Commands

Inside the chat room, you can use the following commands (prefixed with `/`):

* `/clear` - Clears the visual history of your local terminal.
* `/exit` - Disconnects from the room gracefully.
* `/shutdown` - Sends a remote order to force the immediate shutdown of the server, disconnecting all users.

---

## Security Notes

* **NEVER** upload the `data/` folder to public repositories. The `.gitignore` file should already be configured to block this.
* For connections via the external internet (outside the local Wi-Fi or the same machine), use secure TCP tunneling tools like [Ngrok](https://ngrok.com/), or virtual networks like ZeroTier and Radmin VPN.

---
*Developed with a focus on simplicity, privacy, and the power of the terminal.*
