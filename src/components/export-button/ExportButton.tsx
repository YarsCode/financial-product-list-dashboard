import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

// @ts-expect-error throws an error on the file-saver for some unknown reason
import { saveAs } from "file-saver";
import downloadIcon from "../../assets/downloadIcon.svg";
import { DataObj } from "../../types";
import { addCommasToNumber } from "../../utils/numberManipulations";

interface Props {
    dataObj: DataObj
}

const ExportButton: React.FC<Props> = ({dataObj}) => {
    const {
        customerName,
        // customerPhone,
        currentDate,
        planningStep1,
        step1Total,
        planningStep2,
        step2Total,
        totalSum,
      } = dataObj;

    const loadFile = (url: string, callback: (error: Error | null, content: string) => void) => {
        PizZipUtils.getBinaryContent(url, callback);
    };

    const exportToDocx = () => {
        loadFile(`${import.meta.env.BASE_URL}planningTemplate.docx`, function (error, content) {
            if (error) {
                throw error;
            }
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const formattedPlanningStep1 = planningStep1?.map(product => {
                // Adjust the properties to match your data structure
                return `${product.name} - ${product.description}`;
            }).join("\n"); // Join products with a newline for better formatting
    
            const formattedPlanningStep2 = planningStep2?.map(product => {
                // Adjust the properties to match your data structure
                return `${product.name} - ${product.description}`;
            }).join("\n"); // Join products with a newline for better formatting
            
            doc.render({
                customerName: customerName,
                // customerPhone: customerPhone,
                currentDate: currentDate,
                planningStep1: formattedPlanningStep1,
                step1Total: addCommasToNumber(step1Total ?? 0),
                planningStep2: formattedPlanningStep2,
                step2Total: addCommasToNumber(step2Total ?? 0),
                totalSum: addCommasToNumber(totalSum ?? 0),
            });
            const out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); // Output the document using Data-URI
            saveAs(out, `תכנון פיננסי ${customerName}.docx`);
        });
    };

    return (
        <button className="export-button" onClick={exportToDocx}>
            <img src={downloadIcon} alt="download" />
        </button>
    );
};

export default ExportButton;
