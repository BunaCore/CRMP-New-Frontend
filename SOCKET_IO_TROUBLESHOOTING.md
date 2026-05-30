# Socket.IO Connection Error - Troubleshooting Guide

## Error Message

```
[SocketManager] Connection Error: "xhr poll error"
```

## What This Means

Your frontend is trying to connect to the backend's Socket.IO server but failing with an XHR (XMLHttpRequest) polling error. This typically means:

1. **Backend is not running** - The most common cause
2. **Wrong connection URL** - Environment variable is misconfigured
3. **Port mismatch** - Backend running on different port than expected
4. **Network/firewall issues** - Backend unreachable
5. **CORS misconfiguration** - Cross-Origin requests being blocked

---

## Quick Diagnostics

### Step 1: Check If Backend Is Running

Open your browser console (F12) and look for the "Socket.IO Diagnostics" section. The frontend will automatically run diagnostics when a connection fails.

Check the diagnostic results:

- ✓ **PASS** - Proceed to Step 2
- ✗ **FAIL** - Backend is not running or not accessible

### Step 2: Verify Backend Is Accessible

Navigate to: `http://localhost:3001/health`

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-05-24T10:30:00.000Z",
  "message": "Backend is running and accessible"
}
```

If you see this, the backend is running. If you get a connection error, proceed to Step 3.

### Step 3: Check Environment Variables

**Frontend (.env)**

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

This should point to your backend URL.

---

## Common Issues & Solutions

### Issue 1: Backend Not Running

**Symptom:**

- `http://localhost:3001/health` shows connection refused
- Cannot reach the server

**Solution:**

```bash
# Navigate to CRMP-Backend directory
cd CRMP-Backend

# Install dependencies (if needed)
pnpm install

# Start the development server
pnpm run start:dev
# or
npm run start:dev
```

The backend should be available at `http://localhost:3001`

---

### Issue 2: Wrong Port

**Symptom:**

- Backend is running but on a different port (e.g., 3000, 5000)
- Diagnostics show connection refused

**Solution:**
Check what port the backend is running on:

```bash
# Look at backend logs or check the port in package.json scripts
# Update frontend .env file:
NEXT_PUBLIC_API_URL=http://localhost:YOUR_BACKEND_PORT
```

Then restart the frontend dev server.

---

### Issue 3: Firewall/Network Issues

**Symptom:**

- Backend is running but still getting "xhr poll error"
- Can access backend from another computer/port

**Solution:**

1. **Windows Firewall:** Allow Node.js through firewall
   - Windows Defender Firewall > Allow an app through firewall
   - Find Node.js and enable it

2. **Test directly:**

   ```bash
   curl http://localhost:3001/health
   # Should return JSON response
   ```

3. **Check network localhost resolution:**
   ```bash
   ping localhost
   # Should resolve to 127.0.0.1
   ```

---

### Issue 4: CORS Issues

**Symptom:**

- Browser console shows CORS errors
- Socket.IO connection fails in development

**Solution:**
The backend already has CORS enabled for all origins:

```typescript
app.enableCors({
  origin: '*',
});
```

If still failing, verify the backend is using this configuration and restart it.

---

### Issue 5: Authentication Token Issues

**Symptom:**

- Diagnostics pass but Socket.IO still fails
- Backend logs show "no token provided" or "token verification failed"

**Solution:**
Ensure you're logged in before trying to connect to Socket.IO. The connection requires a valid JWT token:

```typescript
// In the frontend, make sure this is called AFTER user authentication
socketManager.connect(authToken);
```

---

## Advanced Troubleshooting

### Enable Detailed Logging

**Frontend:**
The diagnostics will automatically show when there's a connection error. Check the browser console for:

- Connection URL being attempted
- Which transports are being tried (websocket vs polling)
- Specific error messages

**Backend:**
Add logging to see what the server is receiving:

```typescript
// In realtime.gateway.ts handleConnection method
this.logger.log(`[Socket.IO] New connection attempt: ${client.id}`);
this.logger.log(`[Socket.IO] Auth header: ${raw}`);
this.logger.log(`[Socket.IO] Token extracted: ${token ? 'Yes' : 'No'}`);
```

### Test Socket.IO Directly

Use a Socket.IO test client:

```javascript
// In browser console
const socket = io('http://localhost:3001', {
  auth: { token: 'YOUR_JWT_TOKEN_HERE' },
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => console.log('Connected!'));
socket.on('error', (err) => console.error('Error:', err));
socket.on('connect_error', (err) => console.error('Connect error:', err));
```

---

## Connection Flow

```
1. Frontend loads
   ↓
2. User authenticates → receives JWT token
   ↓
3. socketManager.connect(token) is called
   ↓
4. Try WebSocket first
   ↓
   (if fails) Try XHR Polling
   ↓
5. Send auth token via:
   - Socket.IO auth field
   - HTTP Authorization header (for polling)
   ↓
6. Backend verifies JWT and user exists
   ↓
7. Connection established or rejected
```

---

## Diagnostic Checklist

- [ ] Backend is running (`pnpm run start:dev`)
- [ ] Backend is on port 3001 (or correct port is in .env)
- [ ] `http://localhost:3001/health` returns 200 OK
- [ ] `NEXT_PUBLIC_API_URL` is set correctly in `.env`
- [ ] Frontend is restarted after .env changes
- [ ] User is authenticated before Socket.IO connection
- [ ] JWT token is valid and not expired
- [ ] No firewall blocking localhost connections
- [ ] CORS is enabled on backend (`app.enableCors()`)

---

## Still Having Issues?

1. **Check the logs:**
   - Frontend: Browser console (F12)
   - Backend: Terminal output from `pnpm run start:dev`

2. **Restart everything:**

   ```bash
   # Kill all Node processes
   # Restart backend
   # Clear browser cache (Ctrl+Shift+Delete)
   # Restart frontend
   ```

3. **Check for environment variable changes:**
   - After changing `.env` files, restart dev servers
   - Frontend needs restart: `npm run dev`
   - Backend needs restart: `pnpm run start:dev`

4. **Verify ports:**
   ```bash
   # Check if ports are in use
   netstat -ano | findstr :3001  # Backend
   netstat -ano | findstr :3000  # Frontend (typical)
   ```

---

## Further Reading

- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [Socket.IO CORS Configuration](https://socket.io/docs/v4/handling-cors/)
- [NestJS WebSocket Gateway Documentation](https://docs.nestjs.com/websockets/gateways)
