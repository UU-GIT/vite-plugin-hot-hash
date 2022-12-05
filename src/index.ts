import type { Plugin } from 'vite';
const path = require('path');
const crypto = require('crypto');
const { readdirSync, readFileSync, writeFileSync, statSync } = require('fs');
const { formatDate } = require('./utils/index');

/**
 * @readFile 递归读取文件夹下所有文件
 * @param distP 打包输出的文件路径
 * @param dirP 需要递归的文件夹
 * @param fileInfoList 所有读取到的文件列表
 */
function readFile(distP: string, dirP: string, fileInfoList: any[]) {
    readdirSync(dirP).forEach(filename => {

        const dirPath = path.join(dirP, filename);
        const isDir = statSync(dirPath).isDirectory();

        if (isDir) {
            readFile(distP, dirPath, fileInfoList)
            return;
        }

        const content = readFileSync(dirPath);
        const hash = crypto.createHash('sha256');
        hash.update(content);
        const hashContent = hash.digest('hex');

        const filePath = relative(distP, dirPath); // 绝对路径 -> 相对路径

        fileInfoList.push({
            path: filePath,
            hash: hashContent,
            size: content.length,
        });
    });
}

function relative(from, to) {
    const p = path.relative(from, to).replace(/\\/g, '/');
    if (/^[\w_]/.test(p)) {
        return './' + p;
    }
    return p;
}

export function HotHash(options?: Object): Plugin {
    let distPath = '';
    return {
        name: 'vite-plugin-hot-hash',
        enforce: 'post',
        apply: 'build',
        outputOptions(opts) {
            distPath = opts.dir;
        },
        closeBundle() {
            const fileJsonFile = path.join(distPath, 'filesinfo.json');

            const fileInfoList = [];
            readFile(distPath, distPath, fileInfoList);

            const json = {
                lastBuildTDate: formatDate(new Date()),
                fileInfoList,
                ...options
            };
            const text = JSON.stringify(json);
            writeFileSync(fileJsonFile, text);
        }
    };
}