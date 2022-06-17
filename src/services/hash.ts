import { createHash } from 'crypto';

import { ProviderOptions } from '../interfaces';

export default function (data: ProviderOptions): string {
    const sortedKeys = Object.keys(data).sort();

    const pairs = sortedKeys.map(k => `${k}=${data[k as keyof ProviderOptions]}`);

    const hash = createHash('md5')
        .update(pairs.join(','))
        .digest('base64');
    
    return hash;
}