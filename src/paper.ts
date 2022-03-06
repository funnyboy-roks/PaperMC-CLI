import axios from 'axios';
import { createWriteStream } from 'fs';

export const getVersions = async (): Promise<PaperProjects> => {
    const response = await axios.get('https://papermc.io/api/v2/projects/paper');
    return response.data as PaperProjects;
};

export const getBuilds = async (version: string): Promise<PaperBuilds> => {
    const response = await axios.get(`https://papermc.io/api/v2/projects/paper/versions/${version}`);
    return response.data as PaperBuilds;
};

export const getJar = async (version: string, build: Number) => {
    const ws = createWriteStream('paper.jar');
    const response = await axios.get(`https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${build}/downloads/paper-${version}-${build}.jar`, {
        responseType: 'stream',
    });
    response.data.pipe(ws);
};

export type PaperProjects = {
    project_id: string,
    project_name: string,
    version_groups: string[],
    versions: string[],
}

export type PaperBuilds = {
    project_id: string,
    project_name: string,
    version: string,
    builds: Number[],
}
