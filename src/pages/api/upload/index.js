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
      mv(oldPath, newPath, function (err) {
        if (err) return reject(err);
        var txt = fs.readFileSync(newPath, 'utf8');
        resolve(txt);
      });
    });
  });

  dna.parse(data, function (err, snps) {
    if (err) {
      console.error('Error parsing DNA:', err);
      res.status(500).json({ error: 'Error parsing DNA' });
      return;
    }
    console.log(snps);

    res.status(200).json({ snps });
  });
};
