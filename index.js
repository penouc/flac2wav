#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const argv = require('yargs');
const { exec } = require('child_process');



function traverseDirectory (input) {
  async function print(input) {
    const dir = await fs.promises.opendir(input);
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        if(path.extname(dirent.name) === '.flac') {
          const filename = path.resolve(input, dirent.name).replace(/ /g, '\\ ').replace(/(\(|\)|\[|\])/g, "\$1");;
          const outputname = filename.replace('.flac', '.wav');

          exec('ffmpeg -i ' + filename + ' ' + outputname, err => {
            if(err) {
              console.log('出错了  ====>', err);
              return ;
            }else {
              console.log('转换成功 ====>', filename);
            }
          })
        }
      }else if(dirent.isDirectory()) {
        traverseDirectory(path.resolve(input, dirent.name));
      }
    }
  }

  print(input);
}



argv.command('flac2wav [input] [output]', '', (yargs) => {
  yargs
    .positional('input', {
      alias: 'i',
      describe: 'input must be directory',
      default: '.'
    })
}, (argv) => {
  const {input, output} = argv;
  traverseDirectory(input);
})
.option('output', {
  alias: 'o',
  description: 'Run with verbose logging'
})
.argv

