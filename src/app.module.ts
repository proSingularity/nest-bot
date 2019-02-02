import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CatsModule } from './cats/cats.module';
import { loggerMiddleware } from './logger.middleware';
import { RolesGuard } from './roles-guard/roles.guard';
import { RootModule } from './root/root.module';

@Module({
    imports: [RootModule, CatsModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {
    public configure(consumer: MiddlewareConsumer) {
        const ALL = { path: '*', method: RequestMethod.ALL };
        consumer.apply(loggerMiddleware).forRoutes(ALL);
        consumer.apply(CookieParserMiddleware).forRoutes(ALL);
        MorganMiddleware.configure('tiny');
        consumer.apply(MorganMiddleware).forRoutes(ALL);
    }
}