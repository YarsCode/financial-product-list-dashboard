interface Props {
    text: string;
    handleAddSectionBtnClick: () => void;
}

function AddNewSectionButton({ text, handleAddSectionBtnClick }: Props) {
    return (
        <button className="add-section-btn" onClick={handleAddSectionBtnClick}>
            {text}
        </button>
    );
}

export default AddNewSectionButton;
