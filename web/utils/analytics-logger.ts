import { AnalyticsLogger, EventEnvironment } from 'bog-analytics';

const developmentLogger = new AnalyticsLogger({ environment: EventEnvironment.DEVELOPMENT });
const stagingLogger = new AnalyticsLogger({ environment: EventEnvironment.STAGING });
const productionLogger = new AnalyticsLogger({ environment: EventEnvironment.PRODUCTION });

const apiKey = process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string;
developmentLogger.authenticate(apiKey);
stagingLogger.authenticate(apiKey);
productionLogger.authenticate(apiKey);

export function getAnalyticsLogger() {
    return window.location.href.includes("https://fosters.angelsrescue.org") ? productionLogger
        : window.location.href.includes("angels-among-us.netlify.app") ? stagingLogger
            : developmentLogger
}

export function getBrowserName(userAgent: string) {
    // The order matters here, and this may report false positives for unlisted browsers.
    if (userAgent.includes("Firefox")) {
        return "Mozilla Firefox";
    } else if (userAgent.includes("SamsungBrowser")) {
        return "Samsung Internet";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        return "Opera";
    } else if (userAgent.includes("Edge")) {
        return "Microsoft Edge (Legacy)";
    } else if (userAgent.includes("Edg")) {
        return "Microsoft Edge (Chromium)";
    } else if (userAgent.includes("Chrome")) {
        return "Google Chrome or Chromium";
    } else if (userAgent.includes("Safari")) {
        return "Apple Safari";
    } else {
        return "unknown";
    }
}

export { developmentLogger, stagingLogger, productionLogger };
