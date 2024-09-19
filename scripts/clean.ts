import { crayon } from "https://deno.land/x/crayon@3.3.3/mod.ts";
import { existsSync } from "https://deno.land/std@0.224.0/fs/mod.ts";

console.log(crayon.cyan("Cleaning output & dependency directories . . ."));

const cwd = Deno.cwd();

const nextDirPath = `${cwd}/.next`;
if (existsSync(nextDirPath, { isDirectory: true })) {
	Deno.removeSync(nextDirPath, { recursive: true });
	console.log(crayon.green(`The directory '${nextDirPath}' has been removed.`));
} else {
	console.log(crayon.lightBlack(`The directory '${nextDirPath}' does not exist.`));
}

const nodeModulesDirPath = `${cwd}/node_modules`;
if (existsSync(nodeModulesDirPath, { isDirectory: true })) {
	Deno.removeSync(nodeModulesDirPath, { recursive: true });
	console.log(crayon.green(`The directory '${nodeModulesDirPath}' has been removed.`));
} else {
	console.log(crayon.lightBlack(`The directory '${nodeModulesDirPath}' does not exist.`));
}

const outDirPath = `${cwd}/out`;
if (existsSync(outDirPath, { isDirectory: true })) {
	Deno.removeSync(outDirPath, { recursive: true });
	console.log(crayon.green(`The directory '${outDirPath}' has been removed.`));
} else {
	console.log(crayon.lightBlack(`The directory '${outDirPath}' does not exist.`));
}

const targetDirPath = `${cwd}/src-tauri/target`;
if (existsSync(targetDirPath, { isDirectory: true })) {
	Deno.removeSync(targetDirPath, { recursive: true });
	console.log(crayon.green(`The directory '${targetDirPath}' has been removed.`));
} else {
	console.log(crayon.lightBlack(`The directory '${targetDirPath}' does not exist.`));
}

console.log(crayon.green("Everything Clean!"));
