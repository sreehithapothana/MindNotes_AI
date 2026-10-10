const PDFDocument = require('pdfkit');
const docx = require('docx');
const LectureMeeting = require('../models/LectureMeeting');

const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

// PDF Export
const exportPdf = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const doc = new PDFDocument({ margin: 50 });
    let filename = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).font('Helvetica-Bold').text(session.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).font('Helvetica').text(`Date: ${new Date(session.createdAt).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    if (session.summary) {
      doc.fontSize(16).font('Helvetica-Bold').text('Summary');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(session.summary);
      doc.moveDown();
    }

    if (session.mode === 'meeting') {
      if (session.actionItems && session.actionItems.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Action Items');
        doc.moveDown(0.5);
        session.actionItems.forEach(item => {
          doc.fontSize(12).font('Helvetica').text(`• ${item.task} (Owner: ${item.assignee}, Due: ${item.deadline})`);
        });
        doc.moveDown();
      }
      if (session.decisions && session.decisions.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Decisions');
        doc.moveDown(0.5);
        session.decisions.forEach(dec => doc.fontSize(12).font('Helvetica').text(`• ${dec}`));
      }
    } else {
      if (session.studyNotes && session.studyNotes.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Structured Notes');
        doc.moveDown(0.5);
        session.studyNotes.forEach(note => {
          doc.fontSize(14).font('Helvetica-Bold').text(note.topic);
          doc.fontSize(12).font('Helvetica').text(note.content);
          doc.moveDown();
        });
      }
      if (session.definitions && session.definitions.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Definitions');
        doc.moveDown(0.5);
        session.definitions.forEach(def => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${def.term}: `, { continued: true }).font('Helvetica').text(def.definition);
        });
      }
    }

    doc.end();
  } catch (error) {
    next(error);
  }
};

// DOCX Export
const exportDocx = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const children = [];
    
    children.push(new Paragraph({ text: session.title, heading: HeadingLevel.HEADING_1, alignment: docx.AlignmentType.CENTER }));
    children.push(new Paragraph({ text: `Date: ${new Date(session.createdAt).toLocaleDateString()}`, alignment: docx.AlignmentType.CENTER }));
    children.push(new Paragraph({ text: "" })); // Empty line

    if (session.summary) {
      children.push(new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph({ text: session.summary }));
      children.push(new Paragraph({ text: "" }));
    }

    if (session.mode === 'meeting') {
      if (session.actionItems && session.actionItems.length > 0) {
        children.push(new Paragraph({ text: 'Action Items', heading: HeadingLevel.HEADING_2 }));
        session.actionItems.forEach(item => {
          children.push(new Paragraph({ text: `${item.task} (Owner: ${item.assignee}, Due: ${item.deadline})`, bullet: { level: 0 } }));
        });
        children.push(new Paragraph({ text: "" }));
      }
      if (session.decisions && session.decisions.length > 0) {
        children.push(new Paragraph({ text: 'Decisions', heading: HeadingLevel.HEADING_2 }));
        session.decisions.forEach(dec => {
          children.push(new Paragraph({ text: dec, bullet: { level: 0 } }));
        });
      }
    } else {
      if (session.studyNotes && session.studyNotes.length > 0) {
        children.push(new Paragraph({ text: 'Structured Notes', heading: HeadingLevel.HEADING_2 }));
        session.studyNotes.forEach(note => {
          children.push(new Paragraph({ text: note.topic, heading: HeadingLevel.HEADING_3 }));
          children.push(new Paragraph({ text: note.content }));
          children.push(new Paragraph({ text: "" }));
        });
      }
      if (session.definitions && session.definitions.length > 0) {
        children.push(new Paragraph({ text: 'Definitions', heading: HeadingLevel.HEADING_2 }));
        session.definitions.forEach(def => {
          children.push(new Paragraph({ 
            children: [
              new TextRun({ text: `${def.term}: `, bold: true }),
              new TextRun(def.definition)
            ],
            bullet: { level: 0 } 
          }));
        });
      }
    }

    const doc = new Document({
      sections: [{ properties: {}, children: children }]
    });

    const b64string = await Packer.toBase64String(doc);
    const buffer = Buffer.from(b64string, 'base64');

    let filename = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx`;
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = { exportPdf, exportDocx };
