import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'rw'];

export default getRequestConfig(async (params) => {
    const { requestLocale } = params as any;
    let locale = await requestLocale;

    if (!locale) {
        locale = 'en';
    }

    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
