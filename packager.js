import { existsSync, rmSync, mkdirSync, cpSync } from 'fs';
import archiver from 'archiver';
import { createWriteStream } from 'fs';
import path from 'path';



let project_dir = import.meta.dirname;

let output_dir = path.join(project_dir, 'dist');
let build_dir = path.join(output_dir, 'naaraayam');

if (existsSync(build_dir)) {
    console.log('build directory exists, deleting');
    rmSync(build_dir, { recursive: true, force: true });
}

mkdirSync(build_dir, { recursive: true });

let files_and_dirs_to_copy = [
    'manifest.json',
    'options.html',
    'privacy-policy.md',
    'images',
    'css',
    'src',
    'libs',
];

let files_and_dirs_to_remove = [
    'libs/jquery.ime/test',
    'libs/jquery.uls/test',

    'libs/jquery.uls/examples',
    'libs/jquery.ime/examples',

    'libs/jquery.ime/.git',
    'libs/jquery.uls/.git',

    'libs/jquery.ime/.github',
    'libs/jquery.uls/.github',
];

files_and_dirs_to_copy.forEach(file_or_dir => {
    console.log('Copying ' + file_or_dir + ' to distribution directory');
    cpSync(path.join(project_dir, file_or_dir), path.join(build_dir, file_or_dir), { recursive: true });
});

files_and_dirs_to_remove.forEach(file_or_dir => {
    console.log('Removing ' + file_or_dir + ' from distribution directory');
    rmSync(path.join(build_dir, file_or_dir), { recursive: true, force: true });
});

// cpSync(project_dir + '/manifest.json', build_dir + '/manifest.json');
// cpSync(project_dir + '/options.html', build_dir + '/options.html');
// cpSync(project_dir + '/privacy-policy.md', build_dir + '/privacy-policy.md');

// cpSync(project_dir + '/images', build_dir + '/images', { recursive: true });
// cpSync(project_dir + '/css', build_dir + '/css', { recursive: true });

// cpSync(project_dir + '/src', build_dir + '/src', { recursive: true });

// cpSync(project_dir + '/libs', build_dir + '/libs', { recursive: true }, );

// rmSync(build_dir + '/libs/jquery.ime/test', { recursive: true, force: true });
// rmSync(build_dir + '/libs/jquery.uls/test', { recursive: true, force: true });
// rmSync(build_dir + '/libs/jquery.uls/examples', { recursive: true, force: true });

// rmSync(build_dir + '/libs/jquery.ime/.git', { recursive: true, force: true });
// rmSync(build_dir + '/libs/jquery.uls/.git', { recursive: true, force: true });

// rmSync(build_dir + '/libs/jquery.ime/.github', { recursive: true, force: true });
// rmSync(build_dir + '/libs/jquery.uls/.github', { recursive: true, force: true });

let zip_file_path = path.join(output_dir,  'naaraayam.zip');

if (existsSync(zip_file_path)) {
    rmSync(zip_file_path);
}

let zip_file = createWriteStream(zip_file_path);
let archive = archiver('zip', { zlib: { level: 9 } });

archive.on('error', function(err){
    throw err;
});

archive.directory(build_dir, false);

archive.pipe(zip_file);

archive.finalize();
console.log('Packaging done');