import ShellJS from 'shelljs';
const GitState = require('git-state');

ShellJS.config.silent = true;

if (!ShellJS.which('git')) {
	ShellJS.echo('Sorry, this script requires git');
	ShellJS.exit(1);
}

const mainPath = '/home/leonardo/Dev';
const listProjects = ShellJS.exec(`sudo find ${mainPath} -name .git`, { silent: true });

// console.log(listProjects.split('\n'));

listProjects.split('\n').map((path: string) => {
	try {
		const checkFolder = ShellJS.cat(path).stderr.split(':');
		if (checkFolder[checkFolder.length - 1] !== ' Is a directory') return;
	} catch (error) {
		return;
	}
	path = path.replace('/.git', '');

	GitState.isGit(path, (check: boolean) => {
		if (!check) return ShellJS.echo(`Cannot check git state of this folder: ${path}`);
	});
	GitState.check(path, (err: Error, result: { branch: string; ahead: number; dirty: number; untracked: number; stashes: number }) => {
		if (err) throw err;
		console.log(result);
	});
});
