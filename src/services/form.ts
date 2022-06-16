import { FormData } from 'undici';
import { LooseObject } from '../interfaces';

export default function (data: LooseObject): FormData {
    const form = new FormData();

    for (const key in data)
        form.append(key, data[key]);

    return form;
}
    