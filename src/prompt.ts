import inquirer from 'inquirer';
import { getBuilds, getVersions } from './paper';

const bb = new inquirer.ui.BottomBar();

export type JarAnswers = {
    version: string,
    build: number,
    opped: string[],
    whitelist: string[] | null,
    eula: boolean,
}


export const jarPrompt = async (): Promise<JarAnswers> => {
    return await inquirer.prompt([
        {
            type: 'list',
            name: 'version',
            message: 'Which Minecraft version?',
            default: 0,
            loop: false,
            choices: async () => {
                bb.updateBottomBar('Fetching Paper Versions...');
                const data = await getVersions();
                let vers = data.versions.reverse().map(v => ({
                    name: v,
                    value: v
                }));
                vers[0].name += ' (latest)';
                bb.updateBottomBar('');
                return vers;
            },
        },
        {
            type: 'list',
            name: 'build',
            message: 'Which paper build?',
            default: 0,
            loop: false,
            choices: async (answers) => {
                bb.updateBottomBar('Fetching Paper Builds...');
                const data = await getBuilds(answers.version);
                let vers = data.builds.reverse().map(v => ({
                    name: v + '',
                    value: v
                }));
                vers[0].name += ' (latest)';
                bb.updateBottomBar('');
                return vers;
            },
            // validate: (input: string) => {
            //     if (isNaN(+input) || +input < 1024 || +input > 65535 || Math.floor(+input) !== +input) {
            //         return 'Please enter an integer between 1024 and 65535!';
            //     }
            //     return true;
            // },
        },
    ]) as JarAnswers;
};

export type PropertiesAnswers = {
    opped: string[],
    whitelist: string[] | null,
    gamemode: string,
    commandBlocks: boolean,
    motd: string,
    pvp: boolean,
    difficulty: string,
    maxPlayers: number,
    viewDistance: number,
    port: number,
}

export const serverPropertiesPrompt = async (): Promise<PropertiesAnswers|null> => {
    const { customise } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'customise',
            message: 'Would you like to customise the server properties?',
            default: true,
        }
    ]);
    if(!customise) return null;
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'opped',
            message: 'Which users should be opped? (separate by comma)',
            filter: (input: string) => {
                return input.split(',').map(v => v.trim());
            },
        },
        {
            type: 'input',
            name: 'whitelist',
            message: 'Which users should be whitelisted? (separate by comma, blank for whitelist off)',
            transformer: (input: string) => {
                if (input === null) return 'Disabled'.cyan;
                return input;
            },
            filter: (input: string) => {
                return input.length === 0 ? null : input.split(',').map(v => v.trim());
            },
        },
        {
            type: 'list',
            name: 'gamemode',
            message: 'Which gamemode should be used?',
            choices: ['survival', 'creative', 'adventure', 'spectator'],
            transformer: (input: string) => {
                return input.charAt(0).toUpperCase() + input.slice(1);
            },
        },
        {
            type: 'confirm',
            name: 'commandBlocks',
            message: 'Enable Command Blocks?',
            default: true,
        },
        {
            type: 'input',
            name: 'motd',
            message: 'MOTD (Text below server name in menu)',
            default: 'A Minecraft server',
        },
        {
            type: 'confirm',
            name: 'pvp',
            message: 'Enable PvP?',
            default: true,
        },
        {
            type: 'input',
            name: 'viewDistance',
            message: 'Server view distance?',
            default: 10,
            validate: (input: string) => {
                if (isNaN(+input) || +input < 1 || Math.floor(+input) !== +input) {
                    return 'Please enter a positive integer!';
                }
                return true;
            },
        },
        {
            type: 'input',
            name: 'port',
            message: 'What port should the server be running on?',
            default: 25565,
            validate: (input: string) => {
                if (isNaN(+input) || +input < 1024 || +input > 65535 || Math.floor(+input) !== +input) {
                    return 'Please enter an integer between 1024 and 65535!';
                }
                return true;
            },
        },
        {
            type: 'confirm',
            name: 'eula',
            message: 'Do you agree to Minecraft\'s EULA?',
            default: true,
        },
    ]) as PropertiesAnswers;
};
