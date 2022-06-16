import keytar from 'keytar';

export default function (serviceName: string) {

    async function has(key: string) {
        return await keytar.getPassword(serviceName, key) !== null;
    }

    async function get<T>(key: string) {
        if (!await has(key))
            throw new Error('Key not found');

        const value = await keytar.getPassword(serviceName, key) as string;

        return JSON.parse(value) as T;
    }

    async function set<T>(key: string, value: T) {
        const stringValue = JSON.stringify(value);
        await keytar.setPassword(serviceName, key, stringValue);
    }

    async function remove(key: string) {
        await keytar.deletePassword(serviceName, key);
    }

    return {
        has,
        get,
        set,
        remove
    };
}