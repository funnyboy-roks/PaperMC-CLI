// @ts-ignore
import inquirer from 'inquirer';
import { readdirSync } from 'fs';
import colors from 'colors';
import { jarPrompt, serverPropertiesPrompt } from './prompt';
import { getJar } from './paper';
import { createProperties } from './server-properties';

const filesPresent = readdirSync('./');

const overwritePrompt = async (): Promise<boolean> => {
    const { overwrite } = await inquirer.prompt([
        {
            name: 'overwrite',
            message: 'There are files in this directory! Proceeding may remove them. Would you like to proceed?',
            type: 'confirm',
            default: false,
            when: () => filesPresent.length > 0
        }
    ]);
    return overwrite as boolean;
};

// .then((answers) => {
//     if (!answers.overwrite) {
//         console.log(colors.red('Aborting...'));
//         process.exit(0);
//     } else {
//         jarPrompt();
//     }
// })

const main = async () => {

    if (filesPresent.length > 0) {
        const overwrite = await overwritePrompt();
        if (!overwrite) {
            console.log(colors.red('Aborting...'));
            process.exit(0);
        }
    }
    const jarAnswers = await jarPrompt();
    console.log('Downloading Server Jar... '.yellow);
    getJar(jarAnswers.version, jarAnswers.build);

    const propertiesAnswers = await serverPropertiesPrompt();
    if (propertiesAnswers) {
        console.log('Creating Server Properties... '.yellow);
        createProperties(propertiesAnswers);
    }


};

main().then(console.log);
