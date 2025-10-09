const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const path = require('path');

/**
 * Generates a Word resume from template
 * @param {Object} userData - user info and AI content
 * @param {string} templatePath - path to your Word template
 * @param {string} outputPath - path to save generated Word file
 */
function generateWordResume(userData, templatePath, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const content = fs.readFileSync(path.resolve(templatePath), 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

      const experienceBlocks = userData.experience
        .map(exp => `${exp.title} – ${exp.company} | ${exp.dates}\n${exp.details.join('\n')}`)
        .join('\n\n');

      const educationBlocks = userData.education
        .map(ed => `${ed.degree} – ${ed.institution} | ${ed.graduationYear}`)
        .join('\n');

      const templateData = {
        "FULL NAME": userData.name,
        "EMAIL": userData.email,
        "PHONE": userData.phone,
        "professional objective": userData.summary || '',
        "EDUCATION_BLOCKS": educationBlocks,
        "SKILLS": userData.skills.join(', '),
        "EXPERIENCE_BLOCKS": experienceBlocks,
        "achievements": userData.achievements.join('\n')
      };

      doc.render(templateData);

      const buffer = doc.getZip().generate({ type: 'nodebuffer' });
      fs.writeFileSync(path.resolve(outputPath), buffer);

      console.log('Resume generated successfully at:', outputPath);
      resolve();
    } catch (error) {
      console.error('Error generating resume:', error);
      reject(error);
    }
  });
}

module.exports = { generateWordResume };
