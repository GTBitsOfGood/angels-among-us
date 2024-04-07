import { AnalyticsLogger, EventEnvironment } from 'bog-analytics';

const developmentLogger = new AnalyticsLogger({environment: EventEnvironment.DEVELOPMENT});
const stagingLogger = new AnalyticsLogger({environment: EventEnvironment.STAGING});
const productionLogger = new AnalyticsLogger({environment: EventEnvironment.PRODUCTION});

const apiKey = process.env.PUBLIC_NEXT_BOG_ANALYTICS_CLIENT_API_KEY as string;
developmentLogger.authenticate(apiKey);
stagingLogger.authenticate(apiKey);
productionLogger.authenticate(apiKey);

export { developmentLogger, stagingLogger, productionLogger };
