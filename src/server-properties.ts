import { PropertiesAnswers } from './prompt';
import { promises } from 'fs';
import axios from 'axios';

export const getDefaultProperties = async (): Promise<Map<string, any>> => {
    const { data } = await axios.get('https://server.properties/');
    let map = new Map<string, any>();
    data.split('\n').filter((line: string) => line.length >= 1 && !line.startsWith('#') && line.includes('=')).forEach((line: string) => {
        const [key, value] = line.split('=');
        if (value === 'true' || value === 'false') {
            map.set(key, value === 'true');
        } else if (!Number.isNaN(+value)) {
            map.set(key, +value);
        } else {
            map.set(key, value);
        }
    });
    return map;
};

export const createProperties = async (propertiesAnswers: PropertiesAnswers) => {
    const map = await getDefaultProperties();

    map.set('pvp', propertiesAnswers.pvp);
    map.set('gamemode', propertiesAnswers.gamemode);
    map.set('difficulty', propertiesAnswers.difficulty);
    map.set('enable-command-block', propertiesAnswers.commandBlocks);
    map.set('max-players', propertiesAnswers.maxPlayers);
    map.set('motd', propertiesAnswers.motd);
    map.set('view-distance', propertiesAnswers.viewDistance);
    map.set('server-port', propertiesAnswers.port);

    let out = '# This file was generated with PaperMC-CLI (https://www.npmjs.com/package/papermc-cli)';
    map.forEach((value, key) => {
        out += `\n${key}=${value}`;
    });

    await promises.writeFile('server.properties', out);


};
