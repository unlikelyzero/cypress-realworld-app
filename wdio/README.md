# WebdriverIO Test Configuration

This directory contains a flexible WebdriverIO setup that supports multiple automation protocols and browser control methods. The configuration is structured to allow running tests either locally or against a Selenium container with various protocols.

## Configuration Structure

The setup uses a modular configuration approach with a base configuration that's extended for specific use cases:

```
wdio/
├── wdio.conf.base.ts     # Base configuration shared across all setups
├── wdio.conf.local.ts    # Local Chrome testing without Selenium
├── wdio.conf.selenium.ts # Selenium WebDriver protocol
├── wdio.conf.cdp.ts     # Chrome DevTools Protocol
└── wdio.conf.bidi.ts    # WebDriver BiDi protocol
```

### Base Configuration (`wdio.conf.base.ts`)

Contains shared settings across all configurations:
- Test specs location (`./test/specs/**/*.ts`)
- Base URL and timeouts
- Mocha framework settings
- TypeScript compilation options
- Reporter configuration

### Protocol-Specific Configurations

1. **Local Chrome (`wdio.conf.local.ts`)**
   - Uses `chromedriver` service
   - Direct browser control without Selenium
   - Requires `wdio-chromedriver-service` package
   ```typescript
   services: ["chromedriver"]
   ```

2. **Selenium WebDriver (`wdio.conf.selenium.ts`)**
   - Connects to Selenium container on port 4444
   - Uses standard WebDriver protocol
   - Configuration for containerized environment
   ```typescript
   hostname: "localhost",
   port: 4444,
   path: "/wd/hub"
   ```

3. **Chrome DevTools Protocol (`wdio.conf.cdp.ts`)**
   - Uses CDP on port 9222
   - Enables advanced Chrome debugging features
   - Direct connection to Chrome's debugging protocol
   ```typescript
   automationProtocol: "devtools",
   port: 9222
   ```

4. **WebDriver BiDi (`wdio.conf.bidi.ts`)**
   - Uses WebDriver BiDi protocol on port 4445
   - Enables WebSocket connection
   - Latest WebDriver protocol with bi-directional communication
   ```typescript
   automationProtocol: "webdriver",
   port: 4445,
   capabilities: [{
     webSocketUrl: true
   }]
   ```

## Running Tests

Different npm scripts are available for each configuration:

```bash
# Local Chrome (no Selenium)
npm run test:local

# Selenium WebDriver
npm run test:selenium

# Chrome DevTools Protocol
npm run test:cdp

# WebDriver BiDi
npm run test:bidi
```

## Docker Integration

The setup includes a Selenium Chrome container configuration in the docker-compose file with:
- WebDriver port (4444)
- VNC viewer port (7900)
- CDP port (9222)
- WebDriver BiDi port (4445)

Health checks are configured to ensure all required ports are available before the container is marked as ready.

## Dependencies

Key dependencies in `package.json`:
```json
{
  "@wdio/cli": "^8.32.3",
  "@wdio/local-runner": "^8.32.3",
  "@wdio/mocha-framework": "^8.32.3",
  "wdio-chromedriver-service": "^8.1.1"
}
```

## TypeScript Support

The configuration uses TypeScript with:
- `ts-node` for runtime compilation
- Type definitions from `@wdio/types`
- Transpile-only mode for faster execution

## Best Practices

1. Use the appropriate configuration based on your needs:
   - `test:local` for local development
   - `test:selenium` for containerized testing
   - `test:cdp` for advanced debugging
   - `test:bidi` for newer WebDriver features

2. The Selenium container includes VNC support (port 7900) for visual debugging

3. Health checks ensure service availability before tests start

4. Each protocol offers different capabilities:
   - WebDriver: Standard browser automation
   - CDP: Advanced Chrome features and debugging
   - BiDi: Modern bi-directional communication
