import { IncomingForm } from 'formidable';
import fs from 'fs-extra';
var dna = require('dna2json');

var mv = require('mv');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      var oldPath = files.file.filepath;
      var newPath = `./public/uploads/${files.file.originalFilename}`;
      mv(oldPath, newPath, function (err) {});
      res.status(200).json({ fields, files });
      var txt = fs.readFileSync(newPath, 'utf8');
      var json = dna.parse(txt, function (err, snps) {
        console.log(snps);
        fs.writeJson('./public/uploads/dna.json', snps, function (err) {
          if (err) {
            console.error('Error writing JSON file:', err);
            return;
          }
          console.log('SNPs written to snps.json file');

          fs.remove(newPath, function (err) {
            if (err) {
                console.error('Error removing file:', err);
                return;
            }
            console.log('Previous file removed');
          });
        });
      });
    });
  });
};
