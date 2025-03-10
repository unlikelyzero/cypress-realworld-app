import axios from "axios";

const TOXIPROXY_URL = "http://localhost:8474";

interface Proxy {
  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
  toxics: Toxic[];
}

interface Toxic {
  name: string;
  type: string;
  stream: string;
  toxicity: number;
  attributes: {
    latency?: number;
    jitter?: number;
  };
}

async function checkProxies() {
  try {
    console.log("Checking Toxiproxy configuration...\n");

    // Get all proxies
    const { data: proxies } = await axios.get<Record<string, Proxy>>(`${TOXIPROXY_URL}/proxies`);

    // Check if both proxies exist
    const normalProxy = proxies["normal-proxy"];
    const slowProxy = proxies["slow-proxy"];

    if (!normalProxy) {
      throw new Error("Normal proxy not found");
    }
    if (!slowProxy) {
      throw new Error("Slow proxy not found");
    }

    // Check normal proxy configuration
    console.log("Normal Proxy Configuration:");
    console.log("- Name:", normalProxy.name);
    console.log("- Listen:", normalProxy.listen);
    console.log("- Upstream:", normalProxy.upstream);
    console.log("- Enabled:", normalProxy.enabled);
    console.log("- Toxics:", normalProxy.toxics.length);
    console.log();

    // Check slow proxy configuration
    console.log("Slow Proxy Configuration:");
    console.log("- Name:", slowProxy.name);
    console.log("- Listen:", slowProxy.listen);
    console.log("- Upstream:", slowProxy.upstream);
    console.log("- Enabled:", slowProxy.enabled);
    console.log("- Toxics:", slowProxy.toxics.length);

    // Check latency toxic configuration
    const latencyToxic = slowProxy.toxics.find(
      (toxic) => toxic.type === "latency" && toxic.stream === "downstream"
    );

    if (!latencyToxic) {
      throw new Error("Latency toxic not found on slow proxy");
    }

    console.log("\nLatency Toxic Configuration:");
    console.log("- Name:", latencyToxic.name);
    console.log("- Type:", latencyToxic.type);
    console.log("- Stream:", latencyToxic.stream);
    console.log("- Toxicity:", latencyToxic.toxicity);
    console.log("- Latency:", latencyToxic.attributes.latency + "ms");
    console.log("- Jitter:", latencyToxic.attributes.jitter + "ms");

    console.log("\n✅ All proxies are configured correctly!");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("\n❌ Error checking proxies:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        console.error(
          "\nMake sure Toxiproxy is running and proxies are set up using 'npm run setup:proxies'"
        );
      }
    } else {
      console.error("\n❌ Error checking proxies:", error);
    }
    process.exit(1);
  }
}

checkProxies();
