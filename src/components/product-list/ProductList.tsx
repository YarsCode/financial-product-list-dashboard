import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { ContainerType, ProductType } from "../../types";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import Product from "../product/Product.tsx";
import PriceRangeIndicator from "../price-range-indicator/PriceRangeIndicator.tsx";
// import AddNewSectionButton from "../add-new-section-button/AddNewSectionButton.tsx";
import { addCommasToNumber } from "../../utils/numberManipulations.ts";

interface Props {
    container: ContainerType;
    products: ProductType[];
    setStep1Total: React.Dispatch<React.SetStateAction<number>>;
    setStep2Total: React.Dispatch<React.SetStateAction<number>>;
    setStep3Total: React.Dispatch<React.SetStateAction<number>>;
    setActiveSection?: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
}

function ProductList({
    container,
    products,
    setStep1Total,
    setStep2Total,
    setStep3Total,
    setActiveSection,
    className,
}: Props) {
    const [productsSum, setProductsSum] = useState(0);
    
    const productsIds = useMemo(() => {
        return products.map((product) => product.id);
    }, [products]);
    
    // Calculate products sum whenever products change
    useEffect(() => {
        const productsArr = [...products];
        const totalPrice = productsArr.reduce((accumulator, currentValue) => {
            return accumulator + parseFloat(currentValue.price + "");
        }, 0);
        setProductsSum(totalPrice);
    }, [products]);

    useEffect(() => {
        if (container.id === "chosenProductsContainer_step1") {
            setStep1Total(productsSum);
        }

        if (container.id === "chosenProductsContainer_step2") {
            setStep2Total(productsSum);
        }
    }, [productsSum, container.id, setStep1Total, setStep2Total]);

    const { setNodeRef, transform, transition, isDragging } = useSortable({
        id: container.id,
        data: {
            type: "Container",
            container,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        // console.log(style);
        return <li className="product--drag-overlay" ref={setNodeRef} style={style}></li>;
    }

    // Handle the slider value change
    const handleSliderChange = (value: number) => {
        setStep3Total(value);
    };

    return (
        <ul ref={setNodeRef} style={style} className={`${className}${container.id === "chosenProductsContainer_step3" ? " monthly-payment-col" : ""}`}>
            {container.id === "allProductsContainer" ? (
                <SortableContext items={productsIds}>
                    {products.map((product) => (
                        <Product key={product.id} product={product} className="product" />
                    ))}
                </SortableContext>
            ) : container.id === "chosenProductsContainer_step1" ? (
                <>
                    <h3 className="chosen-products--step1">שלב 1 - בניית התשתית</h3>
                    <div className="chosen-products-inner-wrapper">
                        <SortableContext items={productsIds}>
                            {products.map((product) => (
                                <Product key={product.id} product={product} className="product" />
                            ))}
                        </SortableContext>
                    </div>
                    <div className="products-step-sum">
                        <p>עלות כוללת (שלב 1): ₪{addCommasToNumber(productsSum)}</p>
                    </div>
                </>
            ) : container.id === "chosenProductsContainer_step2" ? (
                <>
                    <h3 className="chosen-products--step2">שלב 2 - יישום בפועל</h3>
                    <div className="chosen-products-inner-wrapper">
                        <SortableContext items={productsIds}>
                            {products.map((product) => (
                                <Product key={product.id} product={product} className="product" />
                            ))}
                        </SortableContext>
                    </div>
                    <div className="products-step-sum">
                        <p>עלות כוללת (שלב 2): ₪{addCommasToNumber(productsSum)}</p>
                    </div>
                </>
            ) : container.id === "chosenProductsContainer_step3" ? (
                <PriceRangeIndicator initialValue={94} onChange={handleSliderChange} setActiveSection={setActiveSection} />
            ) : null}
        </ul>
    );
}

export default ProductList;
