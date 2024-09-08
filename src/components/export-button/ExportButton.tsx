import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
// @ts-expect-error throws an error on the file-saver for some unknown reason
import { saveAs } from 'file-saver';
import downloadIcon from "../../assets/downloadIcon.svg"

const ExportButton = () => {
    const exportToDocx = async () => {
        const data = [
            { col1: 'Row 1, Col 1', col2: 'Row 1, Col 2' },
            { col1: 'Row 2, Col 1', col2: 'Row 2, Col 2' },
            { col1: 'Row 3, Col 1', col2: 'Row 3, Col 2' },
        ];
    
        // Dynamic last row values
        const lastRow = { col1: 'Total', col2: '12345' };
    
        // Create the title row (bold)
        const titleRow = new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Title 1', bold: true })] })],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Title 2', bold: true })] })],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                }),
            ],
        });

        const totalRow = new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Total:', bold: true })] })],
                    width: { size: 50, type: WidthType.PERCENTAGE },
                }),
            ],
        });
    
        // Create rows dynamically based on the data array
        const dataRows = data.map(item => (
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph(item.col1)],
                    }),
                    new TableCell({
                        children: [new Paragraph(item.col2)],
                    }),
                ],
            })
        ));
    
        // Create the last row dynamically
        const lastRowEl = new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph(lastRow.col1)],
                }),
                new TableCell({
                    children: [new Paragraph(lastRow.col2)],
                }),
            ],
        });
    
        // Create a paragraph dynamically
        const dynamicParagraph = new Paragraph({
            children: [
                new TextRun({
                    text: "This is a dynamically generated paragraph below the table.",
                }),
            ],
        });
    
        // Create the document with the table and paragraph
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Table({
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                            rows: [titleRow, ...dataRows, totalRow, lastRowEl],
                        }),
                        dynamicParagraph,
                    ],
                },
            ],
        });
    
        // Generate and download the document
        const buffer = await Packer.toBlob(doc);
        saveAs(buffer, "dynamicTable.docx");
    };

    return <button className="export-button" onClick={exportToDocx}>
        <img src={downloadIcon} alt="download" />
    </button>;
};

export default ExportButton;
