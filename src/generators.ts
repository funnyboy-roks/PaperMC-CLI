import axios from 'axios';
import { promises } from 'fs';
import { ScriptAnswers } from './prompt';

export const getUUID = async (playername: string): Promise<string> => {
    const { data } = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + playername);
    const { id } = data;
    const parts = id.match(/(.{8})-?(.{4})-?(.{4})-?(.{4})-?(.{12})/);
    return `${parts[1]}-${parts[2]}-${parts[3]}-${parts[4]}-${parts[5]}`;
};

export const getPlayerObjects = async (names: string[]): Promise<{ name: string; id: string }[]> => {
    return await Promise.all(names.map(async (name: string) => ({
        name,
        id: await getUUID(name),
    })));
};

export const genWhitelist = async (names: string[] | null) => {
    if (!names) return;
    const objs = await getPlayerObjects(names);
    const whitelist = objs.map(obj => ({
        name: obj.name,
        uuid: obj.id,
    }));
    const json = JSON.stringify(whitelist, null, 4);
    await promises.writeFile('./whitelist.json', json);
};

export const genOps = async (names: string[]) => {
    const objs = await getPlayerObjects(names);
    const ops = objs.map(obj => ({
        ...obj,
        level: 4,
        bypassesPlayerLimit: false,
    }));
    const json = JSON.stringify(ops, null, 4);
    await promises.writeFile('./ops.json', json);
};

export const genEULA = async (agree: boolean) =>
    await promises.writeFile('./eula.txt', [
        '# This file was generated with PaperMC-CLI (https://www.npmjs.com/package/papermc-cli)',
        '# You can read the Minecraft EULA here: https://account.mojang.com/documents/minecraft_eula',
        `eula=${agree}`,
    ].join('\n'));

export const getStartScript = async (answers: ScriptAnswers) => {

    if(!answers.createScript) return;

    if(process.platform === 'win32') {
        await promises.writeFile('./start.bat', [
            'rem This file was generated with PaperMC-CLI (https://www.npmjs.com/package/papermc-cli)',
            'rem Run it by typing start.bat in your command prompt',
            `java -Xms${answers.memory}M -Xmx${answers.memory}M -jar paper.jar nogui`,
        ].join('\n'));
    } else {
        await promises.writeFile('start.sh', [
            '#!/bin/bash',
            '# This file was generated with PaperMC-CLI (https://www.npmjs.com/package/papermc-cli)',
            '# Run it by calling `./start.sh` in your terminal',
            `java -Xms${answers.memory}M -Xmx${answers.memory}M -jar paper.jar nogui`,
        ].join('\n'));
    }

}
