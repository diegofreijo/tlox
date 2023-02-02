import { fstat } from 'fs';
import type { Arguments, CommandBuilder } from 'yargs';
import * as fs from 'fs';
import { parse } from 'path';

type Options = {
    file: string;
};

export const command: string = 'run <file>';
export const desc: string = 'Runs the <file> lox file';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
    yargs
        .positional('file', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
    const { file } = argv;

    // process.stdout.write(`AST:\n${ast}`);

    process.exit(0);
};
