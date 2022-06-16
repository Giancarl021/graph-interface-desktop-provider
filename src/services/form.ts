import { LooseObject } from '../interfaces';

export default function (data: LooseObject): string {
    const form: string[] = [];

    for (const key in data)
        form.push(`${key}=${encodeURIComponent(data[key])}`);

    return form.join('&');
}
    