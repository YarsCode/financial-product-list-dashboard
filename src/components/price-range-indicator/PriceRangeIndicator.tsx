import { useEffect, useState, useRef } from "react";
import "./price-range-indicator.scss";

interface PriceRangeIndicatorProps {
    initialValue?: number;
    onChange?: (value: number) => void;
    setActiveSection?: React.Dispatch<React.SetStateAction<string>>;
}

const PriceRangeIndicator: React.FC<PriceRangeIndicatorProps> = ({ initialValue = 94, onChange, setActiveSection }) => {
    const MIN_VALUE = 94;
    const MAX_VALUE = 658;
    const [value, setValue] = useState<number>(Math.min(Math.max(initialValue, MIN_VALUE), MAX_VALUE));
    const [isDragging, setIsDragging] = useState(false);
    const [activeSection, setActiveSectionState] = useState("");
    const sliderRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    // Get the section based on the current value
    const getActiveSection = (val: number): string => {
        if (val >= 94 && val <= 168) {
            return "ליווי בסיסי";
        } else if (val >= 169 && val <= 325) {
            return "ליווי שנתי";
        } else if (val >= 326 && val <= 560) {
            return "ליווי חצי שנתי";
        } else if (val >= 561 && val <= 658) {
            return "ליווי רבעוני";
        }
        return "";
    };

    // Set initial active section on component mount
    useEffect(() => {
        const initialActiveSection = getActiveSection(value);
        setActiveSectionState(initialActiveSection);
        
        // Update parent component's state if the prop is provided
        if (setActiveSection) {
            setActiveSection(initialActiveSection);
        }
    }, []);

    // Update the active section when value changes
    useEffect(() => {
        const newActiveSection = getActiveSection(value);
        setActiveSectionState(newActiveSection);
        
        // Update parent component's state if the prop is provided
        if (setActiveSection) {
            setActiveSection(newActiveSection);
        }
        
        // Call the onChange callback if provided
        if (onChange) {
            onChange(value);
        }

    }, [value, onChange, setActiveSection]);

    // Handle mouse and touch events for dragging
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging || !sliderRef.current) return;

            // Get position for mouse or touch event
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

            const rect = sliderRef.current.getBoundingClientRect();
            const sliderHeight = rect.height;

            // Calculate position relative to slider (0 at bottom, 1 at top)
            // Invert the calculation since we want bottom to be MIN and top to be MAX
            const relativePos = 1 - Math.min(Math.max((clientY - rect.top) / sliderHeight, 0), 1);

            // Convert to actual value
            const newValue = Math.round(MIN_VALUE + relativePos * (MAX_VALUE - MIN_VALUE));
            setValue(newValue);
        };

        const handleEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMove);
            document.addEventListener("touchmove", handleMove);
            document.addEventListener("mouseup", handleEnd);
            document.addEventListener("touchend", handleEnd);
        }

        return () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("touchmove", handleMove);
            document.removeEventListener("mouseup", handleEnd);
            document.removeEventListener("touchend", handleEnd);
        };
    }, [isDragging]);

    // Calculate the knob position from the current value
    const getKnobPosition = () => {
        // Calculate percentage based on value
        const percentage = ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;
        
        // Adjust visual positioning to ensure the top of the knob aligns with the top of the bar
        // at maximum value by limiting the max position to 100 - knobHeightPercentage
        const knobHeightPercentage = 4.5; // Approximate percentage of knob height relative to track
        return Math.min(percentage, 100 - knobHeightPercentage);
    };

    // Start dragging
    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    return (
        <>
            <h3 className="title">שלב 3 - ליווי מתמשך</h3>
            <div className="vertical-slider-container">
                <div className="slider-content">
                    <div className="slider-track-container">
                        <div
                            className="slider-track"
                            ref={sliderRef}
                            onClick={(e) => {
                                if (!sliderRef.current) return;
                                const rect = sliderRef.current.getBoundingClientRect();
                                const sliderHeight = rect.height;
                                const relativePos = 1 - Math.min(Math.max((e.clientY - rect.top) / sliderHeight, 0), 1);
                                const newValue = Math.round(MIN_VALUE + relativePos * (MAX_VALUE - MIN_VALUE));
                                setValue(newValue);
                            }}
                        >
                            <div className="slider-knob" ref={knobRef} style={{ bottom: `${getKnobPosition()}%` }} onMouseDown={handleStart} onTouchStart={handleStart}></div>
                        </div>
                    </div>

                    <div className="section-titles">
                        <div className={`section-title ${activeSection === "ליווי רבעוני" ? "active" : ""}`}>ליווי רבעוני</div>
                        <div className={`section-title ${activeSection === "ליווי חצי שנתי" ? "active" : ""}`}>ליווי חצי שנתי</div>
                        <div className={`section-title ${activeSection === "ליווי שנתי" ? "active" : ""}`}>ליווי שנתי</div>
                        <div className={`section-title ${activeSection === "ליווי בסיסי" ? "active" : ""}`}>ליווי בסיסי</div>
                    </div>
                </div>

                <div className="monthly-cost">
                    <p>עלות הליווי: ₪{value} בחודש</p>
                </div>
            </div>
        </>
    );
};

export default PriceRangeIndicator;
