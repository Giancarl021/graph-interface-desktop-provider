import { createHash } from 'crypto';

import { Options } from '../interfaces';

export default function (data: Options): string {
    const sortedKeys = Object.keys(data).sort();

    const pairs = sortedKeys.map(k => `${k}=${data[k as keyof Options]}`);

    const hash = createHash('md5')
        .update(pairs.join(','))
        .digest('base64');
    
    return hash;
}