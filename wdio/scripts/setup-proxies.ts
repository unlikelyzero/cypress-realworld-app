import axios from "axios";

const TOXIPROXY_URL = "http://localhost:8474";

interface Proxy {
  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
}

interface Toxic {
  name: string;
  type: string;
  stream: string;
  toxicity: number;
  attributes: {
    latency: number;
    jitter: number;
  };
}

async function setupProxies() {
  try {
    // Get and delete existing proxies
    const { data: existingProxies } = await axios.get<Record<string, Proxy>>(
      `${TOXIPROXY_URL}/proxies`
    );
    for (const proxyName in existingProxies) {
      await axios.delete(`${TOXIPROXY_URL}/proxies/${proxyName}`);
    }

    // Create normal proxy on port 3002
    const normalProxy: Proxy = {
      name: "normal-proxy",
      listen: "0.0.0.0:3002",
      upstream: "docker-frontend-1:3000",
      enabled: true,
    };
    await axios.post(`${TOXIPROXY_URL}/proxies`, normalProxy);
    console.log("Created normal proxy on port 3002");

    // Create slow proxy on port 3003 with latency
    const slowProxy: Proxy = {
      name: "slow-proxy",
      listen: "0.0.0.0:3003",
      upstream: "docker-frontend-1:3000",
      enabled: true,
    };
    await axios.post(`${TOXIPROXY_URL}/proxies`, slowProxy);

    // Add latency toxic to slow proxy
    const latencyToxic: Toxic = {
      name: "latency_downstream",
      type: "latency",
      stream: "downstream",
      toxicity: 1,
      attributes: {
        latency: 250,
        jitter: 100,
      },
    };
    await axios.post(`${TOXIPROXY_URL}/proxies/slow-proxy/toxics`, latencyToxic);
    console.log("Created slow proxy on port 3003 with 250ms latency");

    // Create slow selenium proxy on port 4445
    const slowSeleniumProxy: Proxy = {
      name: "slow-selenium-proxy",
      listen: "0.0.0.0:4445",
      upstream: "selenium-chrome:4444",
      enabled: true,
    };
    await axios.post(`${TOXIPROXY_URL}/proxies`, slowSeleniumProxy);

    // Add latency toxic to slow selenium proxy
    const seleniumLatencyToxic: Toxic = {
      name: "latency_downstream",
      type: "latency",
      stream: "downstream",
      toxicity: 1,
      attributes: {
        latency: 250,
        jitter: 100,
      },
    };
    await axios.post(`${TOXIPROXY_URL}/proxies/slow-selenium-proxy/toxics`, seleniumLatencyToxic);
    console.log("Created slow selenium proxy on port 4445 with 250ms latency");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error setting up proxies:", error.response?.data || error.message);
    } else {
      console.error("Error setting up proxies:", error);
    }
    process.exit(1);
  }
}

setupProxies();
