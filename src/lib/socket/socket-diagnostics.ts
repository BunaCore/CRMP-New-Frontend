export interface SocketDiagnostics {
  url: string;
  timestamp: string;
  httpAccessible: boolean;
  httpStatus: number | null;
  healthCheckPassed: boolean;
  socketIoRouteAccessible: boolean;
  socketIoStatus: number | null;
  socketIoResponseText: string | null;
  errorMessage: string | null;
  possibleCauses: string[];
}

export async function diagnoseSocketConnection(url: string): Promise<SocketDiagnostics> {
  const diagnostics: SocketDiagnostics = {
    url,
    timestamp: new Date().toISOString(),
    httpAccessible: false,
    httpStatus: null,
    healthCheckPassed: false,
    socketIoRouteAccessible: false,
    socketIoStatus: null,
    socketIoResponseText: null,
    errorMessage: null,
    possibleCauses: [],
  };

  // Clean URL to avoid double slashes
  const baseUrl = url.endsWith("/") ? url.slice(0, -1) : url;

  // 1. Diagnose HTTP health endpoint
  try {
    const healthUrl = `${baseUrl}/health`;
    console.log(`[Socket Diagnostics] Testing HTTP connection to: ${healthUrl}`);
    const response = await fetch(healthUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
    });

    diagnostics.httpAccessible = true;
    diagnostics.httpStatus = response.status;

    if (response.ok) {
      try {
        const data = await response.json();
        if (data.status === "ok" || data.status === "healthy") {
          diagnostics.healthCheckPassed = true;
        }
      } catch {
        // Not JSON or different format
        diagnostics.healthCheckPassed = response.status === 200;
      }
    }
  } catch (err: unknown) {
    diagnostics.errorMessage = (err instanceof Error ? err.message : String(err)) || String(err);
  }

  // 2. Diagnose Socket.IO endpoint
  try {
    const socketIoUrl = `${baseUrl}/socket.io/?EIO=4&transport=polling`;
    console.log(`[Socket Diagnostics] Testing Socket.IO endpoint: ${socketIoUrl}`);
    const response = await fetch(socketIoUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
    });

    diagnostics.socketIoRouteAccessible = true;
    diagnostics.socketIoStatus = response.status;
    diagnostics.socketIoResponseText = await response.text();
  } catch (err: unknown) {
    // If the HTTP check succeeded but this failed, it's specific to Socket.IO path/CORS
    if (diagnostics.errorMessage === null) {
      diagnostics.errorMessage = (err instanceof Error ? err.message : String(err)) || String(err);
    }
  }

  // Determine possible causes
  if (!diagnostics.httpAccessible && !diagnostics.socketIoRouteAccessible) {
    diagnostics.possibleCauses.push("Backend server is not running (Connection Refused).");
    diagnostics.possibleCauses.push(
      "Wrong backend URL configured. Check your NEXT_PUBLIC_API_URL environment variable.",
    );
    diagnostics.possibleCauses.push("CORS is blocking requests from this origin.");
    diagnostics.possibleCauses.push("Windows Firewall or network settings are blocking port access.");
  } else {
    if (!diagnostics.healthCheckPassed) {
      diagnostics.possibleCauses.push("Backend is reachable but '/health' did not return status 'ok'.");
    }
    if (!diagnostics.socketIoRouteAccessible) {
      diagnostics.possibleCauses.push(
        "Socket.IO route is unreachable. The Socket.IO server might not be initialized on the backend.",
      );
    } else if (diagnostics.socketIoStatus !== 200) {
      diagnostics.possibleCauses.push(
        `Socket.IO handshake returned HTTP ${diagnostics.socketIoStatus}. Check server CORS or initialization.`,
      );
    }
  }

  return diagnostics;
}

export function logDiagnosticResults(results: SocketDiagnostics): void {
  console.group("%c🔌 Socket.IO Connection Diagnostics", "color: #ff9800; font-weight: bold; font-size: 1.1em;");

  console.log(`Tested URL: %c${results.url}`, "font-weight: bold;");
  console.log(`Timestamp: ${results.timestamp}`);

  // HTTP Health Check
  if (results.httpAccessible) {
    if (results.healthCheckPassed) {
      console.log("%c✓ HTTP Health Check: PASSED", "color: #4caf50; font-weight: bold;");
    } else {
      console.log(
        `%c✗ HTTP Health Check: FAILED (Status: ${results.httpStatus})`,
        "color: #f44336; font-weight: bold;",
      );
    }
  } else {
    console.log("%c✗ HTTP Health Check: UNREACHABLE", "color: #f44336; font-weight: bold;");
  }

  // Socket.IO Route Check
  if (results.socketIoRouteAccessible) {
    const isOk = results.socketIoStatus === 200 || results.socketIoResponseText?.includes("sid");
    if (isOk) {
      console.log("%c✓ Socket.IO Route: ACTIVE & RESPONDING", "color: #4caf50; font-weight: bold;");
    } else {
      console.log(
        `%c⚠ Socket.IO Route: RESPONDED WITH WARNING (Status: ${results.socketIoStatus})`,
        "color: #ff9800; font-weight: bold;",
      );
      if (results.socketIoResponseText) {
        console.log("Response payload:", results.socketIoResponseText);
      }
    }
  } else {
    console.log("%c✗ Socket.IO Route: UNREACHABLE", "color: #f44336; font-weight: bold;");
  }

  if (results.errorMessage && !results.httpAccessible) {
    console.log(`Error Details: %c${results.errorMessage}`, "color: #ff5722; font-style: italic;");
  }

  // Possible Causes & Recommendations
  if (results.possibleCauses.length > 0) {
    console.group("%cSuggested Solutions / Checklist", "color: #2196f3; font-weight: bold;");
    results.possibleCauses.forEach((cause, idx) => {
      console.log(`${idx + 1}. ${cause}`);
    });
    console.groupEnd();
  }

  console.groupEnd();
}
