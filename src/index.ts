// @ts-ignore
import inquirer from 'inquirer';
import { promises } from 'fs';
import colors from 'colors';
import { jarPrompt, serverPropertiesPrompt } from './prompt';
import { getJar } from './paper';
import { createProperties } from './server-properties';

const overwritePrompt = async (): Promise<boolean> => {
    const { overwrite } = await inquirer.prompt([
        {
            name: 'overwrite',
            message: 'There are files in this directory! Proceeding may overwrite them. Would you like to proceed?',
            type: 'confirm',
            default: false,
        }
    ]);
    return overwrite as boolean;
};

const main = async () => {
    const filesPresent = await promises.readdir('./');
    if (filesPresent.length > 0) {
        const overwrite = await overwritePrompt();
        if (!overwrite) {
            console.log(colors.red('Aborting...'));
            process.exit(0);
        }
    }
    const jarAnswers = await jarPrompt();
    console.log('Downloading Server Jar... '.yellow);
    getJar(jarAnswers.version, jarAnswers.build).then(() => {});

    const propertiesAnswers = await serverPropertiesPrompt();
    if (propertiesAnswers) {
        console.log('Creating Server Properties... '.yellow);
        createProperties(propertiesAnswers).then(() => {});
    }


};

main().then(console.log);
