export const calculateInputWidthByContent = (inputRef: React.RefObject<HTMLInputElement>, setInputWidth: (width: string) => void) => {
    if (inputRef.current) {
        const inputElement = inputRef.current;

        // Create a hidden span element
        const span = document.createElement("span");

        // Copy the input's text and styles to the span
        span.textContent = inputElement.value;
        const style = window.getComputedStyle(inputElement);
        span.style.font = style.font;
        span.style.fontSize = style.fontSize;
        span.style.fontFamily = style.fontFamily;
        span.style.fontWeight = style.fontWeight;
        span.style.whiteSpace = "pre"; // Ensures spaces are not collapsed

        // Hide the span but keep it in the DOM for width measurement
        span.style.visibility = "hidden";
        document.body.appendChild(span);

        // Get the span's width
        const width = span.offsetWidth;

        // Remove the span from the document
        document.body.removeChild(span);

        setInputWidth(`${width + 6}px`); // Add some padding to the width
    }
};