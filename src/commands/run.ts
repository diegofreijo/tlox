import { fstat } from 'fs';
import type { Arguments, CommandBuilder } from 'yargs';
import * as fs from 'fs';
import { parse } from 'path';
import { evaluate } from '../parser';

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

    console.log(evaluate('1'));
    console.log(evaluate('+1.5'));
    // assert.strictEqual(evaluate('-0.5'), -0.5);
    // assert.strictEqual(evaluate('1 + 2'), 3);
    // assert.strictEqual(evaluate('1 - 2'), -1);
    // assert.strictEqual(evaluate('1 * 2'), 2);
    // assert.strictEqual(evaluate('1 / 2'), 0.5);
    // assert.strictEqual(evaluate('1 + 2 * 3 + 4'), 11);
    console.log(evaluate('(1 + 2) * (3 + 4)'));
    console.log(evaluate('1.2--3.4'));

    // process.stdout.write(`Running "${file}"`);
    // const source = fs.readFileSync(file, 'utf8');
    // const ast = parse(source);


    // process.stdout.write(`AST:\n${ast}`);

    process.exit(0);
};
