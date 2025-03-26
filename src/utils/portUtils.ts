import chalk from "chalk";
import detect from "detect-port";

export const frontendPort = process.env.PORT;
export const backendPort = process.env.VITE_BACKEND_PORT;

// Determine the backend host based on the current port
const determineBackendHost = () => {
  if (typeof window !== "undefined") {
    // If accessing through toxiproxy (ports 3002 or 3003), use localhost
    if (window.location.port === "3002" || window.location.port === "3003") {
      return "localhost";
    }
  }
  // Default to the environment variable or localhost
  return process.env.VITE_BACKEND_HOST || "localhost";
};

export const backendHost = determineBackendHost();

export const getBackendPort = async () => {
  return detect(Number(backendPort))
    .then((_port) => {
      if (Number(backendPort) === _port) {
        console.log(chalk.green(`Backend server running at http://${backendHost}:${backendPort}`));
        return Number(backendPort);
      }

      console.log(
        chalk.red(
          `Failed to start the backend server on port ${backendPort}. \n Starting the backend server on port ${_port}. \n Please update VITE_BACKEND_PORT in the .env file and 'apiUrl' in cypress.json to ${_port}.`
        )
      );
      return _port;
    })
    .catch((err) => {
      console.log(chalk.red(err));
    });
};
