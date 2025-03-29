import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";

// @ts-expect-error throws an error on the file-saver for some unknown reason
import { saveAs } from "file-saver";
import downloadIcon from "../../assets/downloadIcon.svg";
import { DataObj } from "../../types";
import { addCommasToNumber } from "../../utils/numberManipulations";
import { isPhoneNumberValid } from "../../utils/phoneValidation";

interface Props {
    dataObj: DataObj
}

const ExportButton: React.FC<Props> = ({dataObj}) => {
    const {
        customerName,
        customerPhone,
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
        return new Promise<Blob>((resolve, reject) => {
            // loadFile(`${import.meta.env.BASE_URL}planningTemplate.docx`, function (error, content) {
            const docxUrl = import.meta.env.VITE_DOCX_PATH;
            
            loadFile(docxUrl, function (error, content) {
                if (error) {
                    reject(error);
                    return;
                }
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                });

                const formattedPlanningStep1 = planningStep1?.map(product => {
                    return `${product.name} - ${product.description}`;
                }).join("\n");
        
                const formattedPlanningStep2 = planningStep2?.map(product => {
                    return `${product.name} - ${product.description}`;
                }).join("\n");
                
                doc.render({
                    customerName: customerName,
                    customerPhone: customerPhone,
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
                });
                resolve(out);
            });
        });
    };

    const formDataWebhook = async (dataObj: DataObj, docxFile: Blob) => {
        try {
            const formData = new FormData();
            formData.append("data", JSON.stringify(dataObj));
            formData.append("file", docxFile, `תכנון פיננסי ${customerName}.docx`);

            const response = await fetch("https://hook.eu1.make.com/rkb1hhzhr4ysgbuixvmugfnt676l5u7n", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseText = await response.text();
            console.log("Webhook response:", responseText);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    const exportButtonOnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isPhoneNumberValid(customerPhone)) {
            e.preventDefault();
            alert("מספר הטלפון שהוזן אינו תקין");
            return;
        }

        try {
            const docxFile = await exportToDocx();
            saveAs(docxFile, `תכנון פיננסי ${customerName}.docx`);
            await formDataWebhook(dataObj, docxFile);
        } catch (error) {
            console.error("Error generating or sending DOCX file:", error);
        }
    };

    return (
        <button className="export-button" onClick={exportButtonOnClick}>
            <img src={downloadIcon} alt="download" />
        </button>
    );
};

export default ExportButton;
