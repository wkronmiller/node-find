import fs from 'fs';

async function find({ path, matchRe, excludeRe }) {
        if(excludeRe.test(path)) {
                return [];
        }
        const stats = await new Promise((resolve, reject) => fs.stat(path, (err, stats) => (err) ? reject(err): resolve(stats)));
        if(stats.isDirectory()) {
                const files = await new Promise(resolve => fs.readdir(path, (err, files) => {
                        if(err) { throw err; }
                        return resolve(files)
                }));
                const results = await Promise.all(files.map(file => find({ path: `${path}/${file}`, matchRe, excludeRe })));
                return results.reduce((a,b) => a.concat(b), [])
        }
        if(matchRe.test(path)) {
                return [path];
        }
        return [];
}

export default find;
